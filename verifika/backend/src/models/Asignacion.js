// Asignacion.js - Modelo para gestión de asignaciones técnico-cliente en Verifika
const database = require('../config/database');
const logger = require('../config/logger');

class Asignacion {
  constructor(data) {
    this.id = data.id;
    this.tecnico_id = data.tecnico_id;
    this.cliente_id = data.cliente_id;
    this.proyecto_id = data.proyecto_id;
    this.tipo_asignacion = data.tipo_asignacion; // proyecto, soporte, mantenimiento, consultoria
    this.estado = data.estado || 'activa'; // activa, pausada, completada, cancelada
    this.fecha_inicio = data.fecha_inicio;
    this.fecha_fin_estimada = data.fecha_fin_estimada;
    this.fecha_fin_real = data.fecha_fin_real;
    this.prioridad = data.prioridad || 'media'; // baja, media, alta, critica
    this.horas_estimadas = data.horas_estimadas;
    this.horas_trabajadas = data.horas_trabajadas || 0;
    this.porcentaje_avance = data.porcentaje_avance || 0;
    this.competencias_requeridas = data.competencias_requeridas;
    this.descripcion = data.descripcion;
    this.observaciones = data.observaciones;
    this.costo_estimado = data.costo_estimado;
    this.tarifa_hora = data.tarifa_hora;
    this.metadatos = data.metadatos;
    this.asignado_por = data.asignado_por;
    this.fecha_creacion = data.fecha_creacion;
    this.fecha_actualizacion = data.fecha_actualizacion;
    
    // Campos calculados desde JOINs
    this.tecnico_nombre = data.tecnico_nombre;
    this.tecnico_apellido = data.tecnico_apellido;
    this.tecnico_email = data.tecnico_email;
    this.cliente_razon_social = data.cliente_razon_social;
    this.proyecto_nombre = data.proyecto_nombre;
  }

  // Crear nueva asignación
  static async create(asignacionData, creadoPor = null) {
    try {
      logger.info('Creando nueva asignación', { 
        tecnico_id: asignacionData.tecnico_id,
        cliente_id: asignacionData.cliente_id,
        creado_por: creadoPor 
      });

      // Validar que el técnico existe y está activo
      const tecnico = await this.validateTecnico(asignacionData.tecnico_id);
      if (!tecnico) {
        throw new Error('Técnico no encontrado o inactivo');
      }

      // Validar que el cliente existe y está activo
      const cliente = await this.validateCliente(asignacionData.cliente_id);
      if (!cliente) {
        throw new Error('Cliente no encontrado o inactivo');
      }

      // Validar proyecto si se especifica
      if (asignacionData.proyecto_id) {
        const proyecto = await this.validateProyecto(asignacionData.proyecto_id, asignacionData.cliente_id);
        if (!proyecto) {
          throw new Error('Proyecto no encontrado o no pertenece al cliente');
        }
      }

      // Validar competencias requeridas vs competencias del técnico
      if (asignacionData.competencias_requeridas) {
        const competenciasValidas = await this.validateCompetencias(
          asignacionData.tecnico_id, 
          asignacionData.competencias_requeridas
        );
        if (!competenciasValidas.valid) {
          throw new Error(`Técnico no tiene las competencias requeridas: ${competenciasValidas.missing.join(', ')}`);
        }
      }

      // Verificar disponibilidad del técnico
      const disponible = await this.checkTecnicoDisponibilidad(
        asignacionData.tecnico_id,
        asignacionData.fecha_inicio,
        asignacionData.fecha_fin_estimada
      );
      if (!disponible.available) {
        throw new Error(`Técnico no disponible en el período solicitado: ${disponible.reason}`);
      }

      const query = `
        INSERT INTO vf_asignaciones (
          tecnico_id, cliente_id, proyecto_id, tipo_asignacion, estado,
          fecha_inicio, fecha_fin_estimada, prioridad, horas_estimadas,
          competencias_requeridas, descripcion, observaciones,
          costo_estimado, tarifa_hora, metadatos, asignado_por,
          fecha_creacion, fecha_actualizacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const valores = [
        asignacionData.tecnico_id,
        asignacionData.cliente_id,
        asignacionData.proyecto_id || null,
        asignacionData.tipo_asignacion || 'proyecto',
        asignacionData.estado || 'activa',
        asignacionData.fecha_inicio,
        asignacionData.fecha_fin_estimada,
        asignacionData.prioridad || 'media',
        asignacionData.horas_estimadas || 0,
        asignacionData.competencias_requeridas ? JSON.stringify(asignacionData.competencias_requeridas) : null,
        asignacionData.descripcion,
        asignacionData.observaciones,
        asignacionData.costo_estimado || 0,
        asignacionData.tarifa_hora || 0,
        asignacionData.metadatos ? JSON.stringify(asignacionData.metadatos) : null,
        creadoPor
      ];

      const result = await database.query(query, valores);
      const insertId = Array.isArray(result) ? result[0].insertId : result.insertId;
      const asignacion = await this.findById(insertId);

      logger.info('Asignación creada exitosamente', {
        asignacion_id: insertId,
        tecnico_id: asignacionData.tecnico_id,
        cliente_id: asignacionData.cliente_id,
        creado_por: creadoPor
      });

      return asignacion;
    } catch (error) {
      logger.error('Error al crear asignación:', error);
      throw error;
    }
  }

  // Buscar asignación por ID con información relacionada
  static async findById(id) {
    try {
      const query = `
        SELECT a.*, 
               u.nombre as tecnico_nombre, u.apellido as tecnico_apellido, u.email as tecnico_email,
               c.razon_social as cliente_razon_social,
               p.nombre as proyecto_nombre,
               COUNT(DISTINCT act.id) as total_actividades,
               SUM(CASE WHEN act.estado = 'completada' THEN act.horas_trabajadas ELSE 0 END) as horas_reales_trabajadas
        FROM vf_asignaciones a
        LEFT JOIN vf_usuarios u ON a.tecnico_id = u.id
        LEFT JOIN vf_clientes c ON a.cliente_id = c.id
        LEFT JOIN vf_proyectos p ON a.proyecto_id = p.id
        LEFT JOIN vf_actividades act ON a.id = act.asignacion_id
        WHERE a.id = ?
        GROUP BY a.id
      `;

      const result = await database.query(query, [id]);
      const rows = Array.isArray(result) ? result : [result];
      
      if (rows.length === 0) {
        return null;
      }

      const asignacionData = rows[0];
      
      // Parsear JSON fields
      if (asignacionData.competencias_requeridas) {
        try {
          asignacionData.competencias_requeridas = JSON.parse(asignacionData.competencias_requeridas);
        } catch (e) {
          asignacionData.competencias_requeridas = [];
        }
      }
      
      if (asignacionData.metadatos) {
        try {
          asignacionData.metadatos = JSON.parse(asignacionData.metadatos);
        } catch (e) {
          asignacionData.metadatos = {};
        }
      }

      return new Asignacion(asignacionData);
    } catch (error) {
      logger.error('Error al buscar asignación por ID:', error);
      throw error;
    }
  }

  // Listar asignaciones con filtros
  static async findAll(filtros = {}) {
    try {
      let query = `
        SELECT a.*, 
               u.nombre as tecnico_nombre, u.apellido as tecnico_apellido,
               c.razon_social as cliente_razon_social,
               p.nombre as proyecto_nombre,
               COUNT(DISTINCT act.id) as total_actividades,
               SUM(CASE WHEN act.estado = 'completada' THEN act.horas_trabajadas ELSE 0 END) as horas_trabajadas
        FROM vf_asignaciones a
        LEFT JOIN vf_usuarios u ON a.tecnico_id = u.id
        LEFT JOIN vf_clientes c ON a.cliente_id = c.id
        LEFT JOIN vf_proyectos p ON a.proyecto_id = p.id
        LEFT JOIN vf_actividades act ON a.id = act.asignacion_id
      `;
      
      const condiciones = [];
      const valores = [];

      // Filtro por técnico
      if (filtros.tecnico_id) {
        condiciones.push('a.tecnico_id = ?');
        valores.push(filtros.tecnico_id);
      }

      // Filtro por cliente
      if (filtros.cliente_id) {
        condiciones.push('a.cliente_id = ?');
        valores.push(filtros.cliente_id);
      }

      // Filtro por proyecto
      if (filtros.proyecto_id) {
        condiciones.push('a.proyecto_id = ?');
        valores.push(filtros.proyecto_id);
      }

      // Filtro por estado
      if (filtros.estado) {
        condiciones.push('a.estado = ?');
        valores.push(filtros.estado);
      }

      // Filtro por tipo de asignación
      if (filtros.tipo_asignacion) {
        condiciones.push('a.tipo_asignacion = ?');
        valores.push(filtros.tipo_asignacion);
      }

      // Filtro por prioridad
      if (filtros.prioridad) {
        condiciones.push('a.prioridad = ?');
        valores.push(filtros.prioridad);
      }

      // Filtro por rango de fechas
      if (filtros.fecha_desde) {
        condiciones.push('a.fecha_inicio >= ?');
        valores.push(filtros.fecha_desde);
      }

      if (filtros.fecha_hasta) {
        condiciones.push('a.fecha_inicio <= ?');
        valores.push(filtros.fecha_hasta);
      }

      // Búsqueda por texto
      if (filtros.search) {
        condiciones.push(`(
          a.descripcion LIKE ? OR 
          u.nombre LIKE ? OR 
          u.apellido LIKE ? OR
          c.razon_social LIKE ? OR
          p.nombre LIKE ?
        )`);
        const searchTerm = `%${filtros.search}%`;
        valores.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }

      // Agregar condiciones WHERE
      if (condiciones.length > 0) {
        query += ' WHERE ' + condiciones.join(' AND ');
      }

      // GROUP BY
      query += ' GROUP BY a.id';

      // Ordenamiento
      const ordenValido = ['fecha_inicio', 'fecha_creacion', 'prioridad', 'estado', 'horas_estimadas'];
      const orden = ordenValido.includes(filtros.sort) ? filtros.sort : 'fecha_inicio';
      const direccion = filtros.order === 'asc' ? 'ASC' : 'DESC';
      query += ` ORDER BY a.${orden} ${direccion}`;

      // Paginación
      const limit = Math.min(parseInt(filtros.limit) || 20, 100);
      const offset = Math.max(parseInt(filtros.offset) || 0, 0);
      const limitClause = `LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
      query += ` ${limitClause}`;

      const result = await database.query(query, valores);
      const rows = Array.isArray(result) ? result : [result];

      return rows.map(row => {
        // Parsear JSON fields
        if (row.competencias_requeridas) {
          try {
            row.competencias_requeridas = JSON.parse(row.competencias_requeridas);
          } catch (e) {
            row.competencias_requeridas = [];
          }
        }
        
        if (row.metadatos) {
          try {
            row.metadatos = JSON.parse(row.metadatos);
          } catch (e) {
            row.metadatos = {};
          }
        }
        
        return new Asignacion(row);
      });
    } catch (error) {
      logger.error('Error al listar asignaciones:', error);
      throw error;
    }
  }

  // Obtener asignaciones activas
  static async findActive() {
    try {
      const filtros = { estado: 'activa' };
      return await this.findAll(filtros);
    } catch (error) {
      logger.error('Error al obtener asignaciones activas:', error);
      throw error;
    }
  }

  // Obtener asignaciones por técnico
  static async findByTecnico(tecnicoId, filtros = {}) {
    try {
      filtros.tecnico_id = tecnicoId;
      return await this.findAll(filtros);
    } catch (error) {
      logger.error('Error al obtener asignaciones por técnico:', error);
      throw error;
    }
  }

  // Obtener asignaciones por cliente
  static async findByCliente(clienteId, filtros = {}) {
    try {
      filtros.cliente_id = clienteId;
      return await this.findAll(filtros);
    } catch (error) {
      logger.error('Error al obtener asignaciones por cliente:', error);
      throw error;
    }
  }

  // Actualizar asignación
  async update(datosActualizacion) {
    try {
      logger.info('Actualizando asignación', { 
        asignacion_id: this.id, 
        campos: Object.keys(datosActualizacion) 
      });

      const camposPermitidos = [
        'estado', 'fecha_fin_estimada', 'fecha_fin_real', 'prioridad',
        'horas_estimadas', 'horas_trabajadas', 'porcentaje_avance',
        'descripcion', 'observaciones', 'costo_estimado', 'tarifa_hora',
        'metadatos'
      ];

      const actualizaciones = [];
      const valores = [];

      Object.keys(datosActualizacion).forEach(campo => {
        if (camposPermitidos.includes(campo)) {
          actualizaciones.push(`${campo} = ?`);
          if (campo === 'metadatos' && datosActualizacion[campo]) {
            valores.push(JSON.stringify(datosActualizacion[campo]));
          } else {
            valores.push(datosActualizacion[campo]);
          }
        }
      });

      if (actualizaciones.length === 0) {
        throw new Error('No hay campos válidos para actualizar');
      }

      actualizaciones.push('fecha_actualizacion = NOW()');
      valores.push(this.id);

      const query = `UPDATE vf_asignaciones SET ${actualizaciones.join(', ')} WHERE id = ?`;
      await database.query(query, valores);

      // Actualizar propiedades del objeto
      Object.assign(this, datosActualizacion);

      logger.info('Asignación actualizada exitosamente', { asignacion_id: this.id });
      return this;
    } catch (error) {
      logger.error('Error al actualizar asignación:', error);
      throw error;
    }
  }

  // Cambiar estado de la asignación
  async changeStatus(nuevoEstado, usuarioId = null) {
    try {
      const estadosValidos = ['activa', 'pausada', 'completada', 'cancelada'];
      if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error(`Estado no válido: ${nuevoEstado}`);
      }

      logger.info('Cambiando estado de asignación', {
        asignacion_id: this.id,
        estado_anterior: this.estado,
        estado_nuevo: nuevoEstado,
        usuario_id: usuarioId
      });

      // Validaciones especiales por estado
      if (nuevoEstado === 'completada') {
        await this.update({ 
          estado: nuevoEstado,
          fecha_fin_real: new Date().toISOString().split('T')[0],
          porcentaje_avance: 100
        });
      } else {
        await this.update({ estado: nuevoEstado });
      }

      return this;
    } catch (error) {
      logger.error('Error al cambiar estado de asignación:', error);
      throw error;
    }
  }

  // Calcular progreso automático basado en actividades
  async calculateProgress() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_actividades,
          COUNT(CASE WHEN estado = 'completada' THEN 1 END) as actividades_completadas,
          SUM(CASE WHEN estado = 'completada' THEN horas_trabajadas ELSE 0 END) as horas_reales
        FROM vf_actividades 
        WHERE asignacion_id = ?
      `;

      const result = await database.query(query, [this.id]);
      const rows = Array.isArray(result) ? result : [result];
      const stats = rows[0];

      let porcentaje = 0;
      if (stats.total_actividades > 0) {
        porcentaje = Math.round((stats.actividades_completadas / stats.total_actividades) * 100);
      }

      await this.update({
        porcentaje_avance: porcentaje,
        horas_trabajadas: stats.horas_reales || 0
      });

      return {
        porcentaje_avance: porcentaje,
        horas_trabajadas: stats.horas_reales || 0,
        actividades_completadas: stats.actividades_completadas,
        total_actividades: stats.total_actividades
      };
    } catch (error) {
      logger.error('Error al calcular progreso:', error);
      throw error;
    }
  }

  // Validar técnico
  static async validateTecnico(tecnicoId) {
    try {
      const query = 'SELECT id, estado FROM vf_usuarios WHERE id = ? AND rol = "tecnico"';
      const result = await database.query(query, [tecnicoId]);
      const rows = Array.isArray(result) ? result : [result];
      return rows.length > 0 && rows[0].estado === 'activo' ? rows[0] : null;
    } catch (error) {
      logger.error('Error al validar técnico:', error);
      return null;
    }
  }

  // Validar cliente
  static async validateCliente(clienteId) {
    try {
      const query = 'SELECT id, estado FROM vf_clientes WHERE id = ?';
      const result = await database.query(query, [clienteId]);
      const rows = Array.isArray(result) ? result : [result];
      return rows.length > 0 && rows[0].estado === 'activo' ? rows[0] : null;
    } catch (error) {
      logger.error('Error al validar cliente:', error);
      return null;
    }
  }

  // Validar proyecto
  static async validateProyecto(proyectoId, clienteId) {
    try {
      const query = 'SELECT id FROM vf_proyectos WHERE id = ? AND cliente_id = ? AND estado IN ("activo", "planificacion")';
      const result = await database.query(query, [proyectoId, clienteId]);
      const rows = Array.isArray(result) ? result : [result];
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      logger.error('Error al validar proyecto:', error);
      return null;
    }
  }

  // Validar competencias del técnico
  static async validateCompetencias(tecnicoId, competenciasRequeridas) {
    try {
      if (!Array.isArray(competenciasRequeridas) || competenciasRequeridas.length === 0) {
        return { valid: true, missing: [] };
      }

      const placeholders = competenciasRequeridas.map(() => '?').join(',');
      const query = `
        SELECT c.nombre
        FROM vf_competencias c
        INNER JOIN vf_tecnicos_competencias tc ON c.id = tc.competencia_id
        WHERE tc.tecnico_id = ? AND c.nombre IN (${placeholders})
      `;

      const valores = [tecnicoId, ...competenciasRequeridas];
      const result = await database.query(query, valores);
      const rows = Array.isArray(result) ? result : [result];
      
      const competenciasTecnico = rows.map(row => row.nombre);
      const missing = competenciasRequeridas.filter(comp => !competenciasTecnico.includes(comp));

      return {
        valid: missing.length === 0,
        missing: missing,
        available: competenciasTecnico
      };
    } catch (error) {
      logger.error('Error al validar competencias:', error);
      return { valid: false, missing: competenciasRequeridas };
    }
  }

  // Verificar disponibilidad del técnico
  static async checkTecnicoDisponibilidad(tecnicoId, fechaInicio, fechaFin) {
    try {
      // Verificar que el técnico esté disponible
      const tecnicoQuery = `
        SELECT tp.disponibilidad 
        FROM vf_tecnicos_perfiles tp 
        WHERE tp.usuario_id = ?
      `;
      const tecnicoResult = await database.query(tecnicoQuery, [tecnicoId]);
      const tecnicoRows = Array.isArray(tecnicoResult) ? tecnicoResult[0] : tecnicoResult;
      
      if (tecnicoRows.length === 0 || tecnicoRows[0].disponibilidad !== 'disponible') {
        return {
          available: false,
          reason: 'Técnico no disponible o inactivo'
        };
      }

      // Verificar conflictos con otras asignaciones
      const conflictQuery = `
        SELECT COUNT(*) as conflictos
        FROM vf_asignaciones
        WHERE tecnico_id = ? 
          AND estado IN ('activa', 'pausada')
          AND (
            (fecha_inicio <= ? AND fecha_fin_estimada >= ?) OR
            (fecha_inicio <= ? AND fecha_fin_estimada >= ?) OR
            (fecha_inicio >= ? AND fecha_fin_estimada <= ?)
          )
      `;

      const conflictResult = await database.query(conflictQuery, [
        tecnicoId, fechaInicio, fechaInicio, fechaFin, fechaFin, fechaInicio, fechaFin
      ]);
      const conflictRows = Array.isArray(conflictResult) ? conflictResult[0] : conflictResult;

      if (conflictRows[0].conflictos > 0) {
        return {
          available: false,
          reason: 'Técnico tiene asignaciones conflictivas en el período'
        };
      }

      return { available: true, reason: 'Disponible' };
    } catch (error) {
      logger.error('Error al verificar disponibilidad:', error);
      return { available: false, reason: 'Error al verificar disponibilidad' };
    }
  }

  // Obtener estadísticas de asignaciones
  static async getStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_asignaciones,
          COUNT(CASE WHEN estado = 'activa' THEN 1 END) as asignaciones_activas,
          COUNT(CASE WHEN estado = 'completada' THEN 1 END) as asignaciones_completadas,
          COUNT(CASE WHEN estado = 'pausada' THEN 1 END) as asignaciones_pausadas,
          COUNT(CASE WHEN estado = 'cancelada' THEN 1 END) as asignaciones_canceladas,
          AVG(porcentaje_avance) as promedio_avance,
          SUM(horas_estimadas) as total_horas_estimadas,
          SUM(horas_trabajadas) as total_horas_trabajadas,
          AVG(costo_estimado) as promedio_costo_estimado
        FROM vf_asignaciones
      `;

      const result = await database.query(query);
      const rows = Array.isArray(result) ? result : [result];
      return rows[0];
    } catch (error) {
      logger.error('Error al obtener estadísticas de asignaciones:', error);
      throw error;
    }
  }

  // Convertir a JSON para respuestas API
  toJSON() {
    return {
      id: this.id,
      tecnico_id: this.tecnico_id,
      cliente_id: this.cliente_id,
      proyecto_id: this.proyecto_id,
      tipo_asignacion: this.tipo_asignacion,
      estado: this.estado,
      fecha_inicio: this.fecha_inicio,
      fecha_fin_estimada: this.fecha_fin_estimada,
      fecha_fin_real: this.fecha_fin_real,
      prioridad: this.prioridad,
      horas_estimadas: this.horas_estimadas,
      horas_trabajadas: this.horas_trabajadas,
      porcentaje_avance: this.porcentaje_avance,
      competencias_requeridas: this.competencias_requeridas,
      descripcion: this.descripcion,
      observaciones: this.observaciones,
      costo_estimado: this.costo_estimado,
      tarifa_hora: this.tarifa_hora,
      metadatos: this.metadatos,
      asignado_por: this.asignado_por,
      fecha_creacion: this.fecha_creacion,
      fecha_actualizacion: this.fecha_actualizacion,
      // Información relacionada
      tecnico_nombre: this.tecnico_nombre,
      tecnico_apellido: this.tecnico_apellido,
      tecnico_email: this.tecnico_email,
      cliente_razon_social: this.cliente_razon_social,
      proyecto_nombre: this.proyecto_nombre,
      total_actividades: this.total_actividades,
      horas_reales_trabajadas: this.horas_reales_trabajadas
    };
  }
}

module.exports = Asignacion;
