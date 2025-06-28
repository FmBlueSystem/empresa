// Asignacion.js - Modelo para gestión de asignaciones técnico-cliente en Verifika
const database = require('../config/database');
const logger = require('../config/logger');

class Asignacion {
  constructor(data) {
    this.id = data.id;
    this.tecnico_id = data.tecnico_id;
    this.cliente_id = data.cliente_id;
    this.proyecto_nombre = data.proyecto_nombre;
    this.descripcion = data.descripcion;
    this.fecha_inicio = data.fecha_inicio;
    this.fecha_fin_estimada = data.fecha_fin_estimada;
    this.fecha_fin_real = data.fecha_fin_real;
    this.estado = data.estado || 'activa'; // activa, pausada, finalizada, cancelada
    this.tarifa_acordada = data.tarifa_acordada;
    this.moneda = data.moneda || 'EUR';
    this.horas_estimadas = data.horas_estimadas;
    this.competencias_requeridas = data.competencias_requeridas;
    this.observaciones = data.observaciones;
    this.fecha_creacion = data.fecha_creacion;
    this.fecha_actualizacion = data.fecha_actualizacion;
    this.creado_por = data.creado_por;
    
    // Campos calculados desde JOINs
    this.tecnico_nombre = data.tecnico_nombre;
    this.tecnico_apellido = data.tecnico_apellido;
    this.tecnico_email = data.tecnico_email;
    this.cliente_nombre_empresa = data.cliente_nombre_empresa;
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
          tecnico_id, cliente_id, proyecto_nombre, descripcion, 
          fecha_inicio, fecha_fin_estimada, estado, tarifa_acordada, 
          moneda, horas_estimadas, competencias_requeridas, observaciones, creado_por
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const valores = [
        asignacionData.tecnico_id,
        asignacionData.cliente_id,
        asignacionData.proyecto_nombre,
        asignacionData.descripcion,
        asignacionData.fecha_inicio,
        asignacionData.fecha_fin_estimada,
        asignacionData.estado || 'activa',
        asignacionData.tarifa_acordada || 0,
        asignacionData.moneda || 'EUR',
        asignacionData.horas_estimadas || 0,
        asignacionData.competencias_requeridas ? JSON.stringify(asignacionData.competencias_requeridas) : null,
        asignacionData.observaciones,
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
               c.nombre_empresa as cliente_nombre_empresa,
               COUNT(DISTINCT act.id) as total_actividades,
               SUM(CASE WHEN act.estado = 'completada' THEN act.horas_trabajadas ELSE 0 END) as horas_reales_trabajadas
        FROM vf_asignaciones a
        LEFT JOIN vf_usuarios u ON a.tecnico_id = u.id
        LEFT JOIN vf_clientes c ON a.cliente_id = c.id
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
               c.nombre_empresa as cliente_nombre_empresa,
               COUNT(DISTINCT act.id) as total_actividades,
               SUM(CASE WHEN act.estado = 'completada' THEN act.horas_trabajadas ELSE 0 END) as horas_trabajadas
        FROM vf_asignaciones a
        LEFT JOIN vf_usuarios u ON a.tecnico_id = u.id
        LEFT JOIN vf_clientes c ON a.cliente_id = c.id
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

      // Filtro por proyecto (por nombre ya que no existe proyecto_id)
      if (filtros.proyecto_nombre) {
        condiciones.push('a.proyecto_nombre LIKE ?');
        valores.push(`%${filtros.proyecto_nombre}%`);
      }

      // Filtro por estado
      if (filtros.estado) {
        condiciones.push('a.estado = ?');
        valores.push(filtros.estado);
      }

      // Nota: tipo_asignacion y prioridad no existen en la tabla real
      // Filtros removidos para compatibilidad con esquema real

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
          a.proyecto_nombre LIKE ? OR 
          u.nombre LIKE ? OR 
          u.apellido LIKE ? OR
          c.nombre_empresa LIKE ?
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

      // Ordenamiento (solo campos que existen en la tabla real)
      const ordenValido = ['fecha_inicio', 'fecha_creacion', 'estado', 'horas_estimadas'];
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
        'estado', 'fecha_fin_estimada', 'fecha_fin_real',
        'horas_estimadas', 'descripcion', 'observaciones', 
        'tarifa_acordada', 'moneda', 'competencias_requeridas'
      ];

      const actualizaciones = [];
      const valores = [];

      Object.keys(datosActualizacion).forEach(campo => {
        if (camposPermitidos.includes(campo)) {
          actualizaciones.push(`${campo} = ?`);
          if (campo === 'competencias_requeridas' && datosActualizacion[campo]) {
            valores.push(JSON.stringify(datosActualizacion[campo]));
          } else {
            valores.push(datosActualizacion[campo]);
          }
        }
      });

      if (actualizaciones.length === 0) {
        throw new Error('No hay campos válidos para actualizar');
      }

      actualizaciones.push('fecha_actualizacion = CURRENT_TIMESTAMP');
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
      if (nuevoEstado === 'finalizada') {
        await this.update({ 
          estado: nuevoEstado,
          fecha_fin_real: new Date().toISOString().split('T')[0]
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

      // No actualizar porcentaje_avance ya que no existe en la tabla
      // Solo retornar las estadísticas calculadas
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
      // Validar proyecto por nombre ya que no existe tabla vf_proyectos
      // Por ahora, asumir que el proyecto es válido si se proporciona
      return { id: proyectoId, nombre: proyectoId };
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
      // Verificar que el técnico esté activo (simplificado)
      const tecnicoQuery = `
        SELECT estado 
        FROM vf_usuarios 
        WHERE id = ? AND rol = 'tecnico'
      `;
      const tecnicoResult = await database.query(tecnicoQuery, [tecnicoId]);
      const tecnicoRows = Array.isArray(tecnicoResult) ? tecnicoResult : [tecnicoResult];
      
      if (tecnicoRows.length === 0 || tecnicoRows[0].estado !== 'activo') {
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
      const conflictRows = Array.isArray(conflictResult) ? conflictResult : [conflictResult];

      if (conflictRows[0] && conflictRows[0].conflictos > 0) {
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
          COUNT(CASE WHEN estado = 'finalizada' THEN 1 END) as asignaciones_finalizadas,
          COUNT(CASE WHEN estado = 'pausada' THEN 1 END) as asignaciones_pausadas,
          COUNT(CASE WHEN estado = 'cancelada' THEN 1 END) as asignaciones_canceladas,
          SUM(horas_estimadas) as total_horas_estimadas,
          AVG(tarifa_acordada) as promedio_tarifa
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
      proyecto_nombre: this.proyecto_nombre,
      estado: this.estado,
      fecha_inicio: this.fecha_inicio,
      fecha_fin_estimada: this.fecha_fin_estimada,
      fecha_fin_real: this.fecha_fin_real,
      horas_estimadas: this.horas_estimadas,
      competencias_requeridas: this.competencias_requeridas,
      descripcion: this.descripcion,
      observaciones: this.observaciones,
      tarifa_acordada: this.tarifa_acordada,
      moneda: this.moneda,
      creado_por: this.creado_por,
      fecha_creacion: this.fecha_creacion,
      fecha_actualizacion: this.fecha_actualizacion,
      // Información relacionada
      tecnico_nombre: this.tecnico_nombre,
      tecnico_apellido: this.tecnico_apellido,
      tecnico_email: this.tecnico_email,
      cliente_nombre_empresa: this.cliente_nombre_empresa,
      total_actividades: this.total_actividades,
      horas_reales_trabajadas: this.horas_reales_trabajadas
    };
  }
}

module.exports = Asignacion;
