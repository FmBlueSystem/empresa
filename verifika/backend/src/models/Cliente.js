// Cliente.js - Modelo para gestión de clientes en Verifika
const database = require('../config/database');
const logger = require('../config/logger');

class Cliente {
  constructor(data) {
    this.id = data.id;
    this.usuario_id = data.usuario_id;
    this.nombre_empresa = data.nombre_empresa;
    this.cif = data.cif;
    this.direccion_fiscal = data.direccion_fiscal;
    this.ciudad = data.ciudad;
    this.pais = data.pais || 'España';
    this.telefono_corporativo = data.telefono_corporativo;
    this.sitio_web = data.sitio_web;
    this.sector_actividad = data.sector_actividad;
    this.numero_empleados = data.numero_empleados;
    this.configuracion_validacion = data.configuracion_validacion;
    this.requiere_validacion_doble = data.requiere_validacion_doble || false;
    this.tiempo_limite_validacion = data.tiempo_limite_validacion || 72;
    this.fecha_creacion = data.fecha_creacion;
    this.fecha_actualizacion = data.fecha_actualizacion;
    
    // Campos calculados/compatibilidad
    this.razon_social = data.nombre_empresa; // Alias para compatibilidad
    this.estado = 'activo'; // Default activo (no existe en tabla real)
  }

  // Crear nuevo cliente
  static async create(clienteData, creadoPor = null) {
    try {
      logger.info('Creando nuevo cliente', { nombre_empresa: clienteData.nombre_empresa, usuario_id: clienteData.usuario_id });

      // Verificar si ya existe cliente con mismo CIF
      if (clienteData.cif) {
        const existente = await this.findByCif(clienteData.cif);
        if (existente) {
          throw new Error(`Ya existe un cliente con CIF ${clienteData.cif}`);
        }
      }

      const query = `
        INSERT INTO vf_clientes (
          usuario_id, nombre_empresa, cif, direccion_fiscal, ciudad, pais,
          telefono_corporativo, sitio_web, sector_actividad, numero_empleados,
          configuracion_validacion, requiere_validacion_doble, tiempo_limite_validacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const valores = [
        clienteData.usuario_id,
        clienteData.nombre_empresa,
        clienteData.cif,
        clienteData.direccion_fiscal,
        clienteData.ciudad,
        clienteData.pais || 'España',
        clienteData.telefono_corporativo,
        clienteData.sitio_web,
        clienteData.sector_actividad,
        clienteData.numero_empleados || 1,
        clienteData.configuracion_validacion ? JSON.stringify(clienteData.configuracion_validacion) : null,
        clienteData.requiere_validacion_doble ? 1 : 0,
        clienteData.tiempo_limite_validacion || 72
      ];

      const result = await database.query(query, valores);
      const insertId = Array.isArray(result) ? result[0].insertId : result.insertId;
      const cliente = await this.findById(insertId);

      logger.info('Cliente creado exitosamente', {
        cliente_id: insertId,
        nombre_empresa: clienteData.nombre_empresa,
        usuario_id: clienteData.usuario_id
      });

      return cliente;
    } catch (error) {
      logger.error('Error al crear cliente:', error);
      throw error;
    }
  }

  // Buscar cliente por ID
  static async findById(id) {
    try {
      const query = `
        SELECT c.*
        FROM vf_clientes c
        WHERE c.id = ?
      `;

      const rows = await database.query(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }

      const clienteData = rows[0];
      if (clienteData.configuracion_validacion) {
        try {
          clienteData.configuracion_validacion = JSON.parse(clienteData.configuracion_validacion);
        } catch (e) {
          clienteData.configuracion_validacion = {};
        }
      }

      return new Cliente(clienteData);
    } catch (error) {
      logger.error('Error al buscar cliente por ID:', error);
      throw error;
    }
  }

  // Buscar cliente por CIF
  static async findByCif(cif) {
    try {
      const query = 'SELECT * FROM vf_clientes WHERE cif = ? LIMIT 1';
      const rows = await database.query(query, [cif]);
      
      if (rows.length === 0) {
        return null;
      }

      return new Cliente(rows[0]);
    } catch (error) {
      logger.error('Error al buscar cliente por CIF:', error);
      throw error;
    }
  }

  // Listar clientes con filtros
  static async findAll(filtros = {}) {
    try {
      let query = `SELECT c.* FROM vf_clientes c`;
      
      const condiciones = [];
      const valores = [];

      // Filtro por ciudad
      if (filtros.ciudad) {
        condiciones.push('c.ciudad LIKE ?');
        valores.push(`%${filtros.ciudad}%`);
      }

      // Filtro por sector
      if (filtros.sector_actividad) {
        condiciones.push('c.sector_actividad = ?');
        valores.push(filtros.sector_actividad);
      }

      // Búsqueda por texto
      if (filtros.search) {
        condiciones.push(`(
          c.nombre_empresa LIKE ? OR 
          c.cif LIKE ? OR
          c.sitio_web LIKE ?
        )`);
        const searchTerm = `%${filtros.search}%`;
        valores.push(searchTerm, searchTerm, searchTerm);
      }

      // Agregar condiciones WHERE
      if (condiciones.length > 0) {
        query += ' WHERE ' + condiciones.join(' AND ');
      }

      // Ordenamiento
      const ordenValido = ['nombre_empresa', 'fecha_creacion', 'ciudad'];
      const orden = ordenValido.includes(filtros.sort) ? filtros.sort : 'nombre_empresa';
      const direccion = filtros.order === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${orden} ${direccion}`;

      // Paginación
      const limit = Math.min(parseInt(filtros.limit) || 20, 100);
      const offset = Math.max(parseInt(filtros.offset) || 0, 0);
      const limitClause = `LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
      query += ` ${limitClause}`;

      const rows = await database.query(query, valores);

      return rows.map(row => {
        if (row.configuracion_validacion) {
          try {
            row.configuracion_validacion = JSON.parse(row.configuracion_validacion);
          } catch (e) {
            row.configuracion_validacion = {};
          }
        }
        return new Cliente(row);
      });
    } catch (error) {
      logger.error('Error al listar clientes:', error);
      throw error;
    }
  }

  // Obtener clientes activos para asignaciones
  static async findActive() {
    try {
      const query = `
        SELECT c.*
        FROM vf_clientes c
        ORDER BY c.nombre_empresa ASC
      `;

      const rows = await database.query(query);
      return rows.map(row => new Cliente(row));
    } catch (error) {
      logger.error('Error al obtener clientes activos:', error);
      throw error;
    }
  }

  // Actualizar cliente
  async update(datosActualizacion) {
    try {
      logger.info('Actualizando cliente', { cliente_id: this.id, campos: Object.keys(datosActualizacion) });

      const camposPermitidos = [
        'nombre_empresa', 'cif', 'direccion_fiscal', 'ciudad', 'pais',
        'telefono_corporativo', 'sitio_web', 'sector_actividad', 'numero_empleados',
        'configuracion_validacion', 'requiere_validacion_doble', 'tiempo_limite_validacion'
      ];

      const actualizaciones = [];
      const valores = [];

      Object.keys(datosActualizacion).forEach(campo => {
        if (camposPermitidos.includes(campo)) {
          actualizaciones.push(`${campo} = ?`);
          if (campo === 'configuracion_validacion' && datosActualizacion[campo]) {
            valores.push(JSON.stringify(datosActualizacion[campo]));
          } else if (campo === 'requiere_validacion_doble') {
            valores.push(datosActualizacion[campo] ? 1 : 0);
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

      const query = `UPDATE vf_clientes SET ${actualizaciones.join(', ')} WHERE id = ?`;
      await database.query(query, valores);

      // Actualizar propiedades del objeto
      Object.assign(this, datosActualizacion);

      logger.info('Cliente actualizado exitosamente', { cliente_id: this.id });
      return this;
    } catch (error) {
      logger.error('Error al actualizar cliente:', error);
      throw error;
    }
  }

  // Cambiar estado del cliente (nota: estado no existe en tabla real, solo simulado)
  async changeStatus(nuevoEstado, usuarioId = null) {
    try {
      logger.info('Simulando cambio de estado de cliente', {
        cliente_id: this.id,
        estado_anterior: this.estado,
        estado_nuevo: nuevoEstado,
        usuario_id: usuarioId
      });

      // Solo actualizar fecha ya que estado no existe en la tabla real
      const query = 'UPDATE vf_clientes SET fecha_actualizacion = CURRENT_TIMESTAMP WHERE id = ?';
      await database.query(query, [this.id]);

      this.estado = nuevoEstado; // Solo en memoria

      return this;
    } catch (error) {
      logger.error('Error al cambiar estado del cliente:', error);
      throw error;
    }
  }

  // Obtener proyectos del cliente
  async getProyectos(filtros = {}) {
    try {
      let query = `
        SELECT p.*, 
               COUNT(DISTINCT a.id) as total_actividades,
               SUM(CASE WHEN a.estado = 'completada' THEN a.horas_trabajadas ELSE 0 END) as horas_completadas,
               COUNT(DISTINCT t.id) as tecnicos_asignados
        FROM vf_proyectos p
        LEFT JOIN vf_actividades a ON p.id = a.proyecto_id
        LEFT JOIN vf_asignaciones asig ON p.id = asig.proyecto_id
        LEFT JOIN vf_tecnicos t ON asig.tecnico_id = t.id
        WHERE p.cliente_id = ?
      `;

      const valores = [this.id];

      // Filtro por estado del proyecto
      if (filtros.estado) {
        query += ' AND p.estado = ?';
        valores.push(filtros.estado);
      }

      query += ' GROUP BY p.id ORDER BY p.fecha_inicio DESC';

      // Paginación
      if (filtros.limit) {
        const limit = Math.min(parseInt(filtros.limit), 50);
        const offset = Math.max(parseInt(filtros.offset) || 0, 0);
        const limitClause = `LIMIT ${parseInt(limit)} OFFSET ${parseInt(offset)}`;
        query += ` ${limitClause}`;
      }

      const rows = await database.query(query, valores);
      return rows;
    } catch (error) {
      logger.error('Error al obtener proyectos del cliente:', error);
      throw error;
    }
  }

  // Obtener validadores asignados al cliente
  async getValidadores() {
    try {
      const query = `
        SELECT cv.*, u.nombre, u.apellido, u.email
        FROM vf_cliente_validadores cv
        JOIN vf_usuarios u ON cv.usuario_id = u.id
        WHERE cv.cliente_id = ? AND cv.activo = 1
        ORDER BY cv.fecha_asignacion DESC
      `;

      const rows = await database.query(query, [this.id]);
      return rows;
    } catch (error) {
      logger.error('Error al obtener validadores del cliente:', error);
      throw error;
    }
  }

  // Asignar validador al cliente
  async asignarValidador(usuarioId, asignadoPor = null) {
    try {
      // Verificar si ya existe la asignación
      const existeQuery = 'SELECT id FROM vf_cliente_validadores WHERE cliente_id = ? AND usuario_id = ? AND activo = 1';
      const existe = await database.query(existeQuery, [this.id, usuarioId]);

      if (existe.length > 0) {
        throw new Error('El usuario ya está asignado como validador de este cliente');
      }

      const query = `
        INSERT INTO vf_cliente_validadores (cliente_id, usuario_id, asignado_por, fecha_asignacion)
        VALUES (?, ?, ?, NOW())
      `;

      await database.query(query, [this.id, usuarioId, asignadoPor]);

      logger.info('Validador asignado al cliente', {
        cliente_id: this.id,
        usuario_id: usuarioId,
        asignado_por: asignadoPor
      });

      return true;
    } catch (error) {
      logger.error('Error al asignar validador:', error);
      throw error;
    }
  }

  // Obtener estadísticas del cliente
  async getEstadisticas() {
    try {
      const query = `
        SELECT 
          COUNT(DISTINCT p.id) as total_proyectos,
          COUNT(DISTINCT CASE WHEN p.estado = 'activo' THEN p.id END) as proyectos_activos,
          COUNT(DISTINCT a.id) as total_actividades,
          COUNT(DISTINCT CASE WHEN a.estado = 'completada' THEN a.id END) as actividades_completadas,
          SUM(CASE WHEN a.estado = 'completada' THEN a.horas_trabajadas ELSE 0 END) as total_horas_facturadas,
          COUNT(DISTINCT t.id) as tecnicos_asignados,
          COUNT(DISTINCT cv.usuario_id) as validadores_asignados
        FROM vf_clientes c
        LEFT JOIN vf_proyectos p ON c.id = p.cliente_id
        LEFT JOIN vf_actividades a ON p.id = a.proyecto_id
        LEFT JOIN vf_asignaciones asig ON p.id = asig.proyecto_id
        LEFT JOIN vf_tecnicos t ON asig.tecnico_id = t.id
        LEFT JOIN vf_cliente_validadores cv ON c.id = cv.cliente_id AND cv.activo = 1
        WHERE c.id = ?
        GROUP BY c.id
      `;

      const rows = await database.query(query, [this.id]);
      return rows[0] || {};
    } catch (error) {
      logger.error('Error al obtener estadísticas del cliente:', error);
      throw error;
    }
  }

  // Obtener estadísticas generales de clientes (para admins)
  static async getStats() {
    try {
      const query = `
        SELECT 
          COUNT(*) as total_clientes,
          COUNT(CASE WHEN requiere_validacion_doble = 1 THEN 1 END) as clientes_validacion_doble,
          AVG(tiempo_limite_validacion) as promedio_tiempo_limite,
          AVG(numero_empleados) as promedio_empleados
        FROM vf_clientes
      `;

      const rows = await database.query(query);
      return rows[0];
    } catch (error) {
      logger.error('Error al obtener estadísticas de clientes:', error);
      throw error;
    }
  }

  // Soft delete
  async delete() {
    try {
      logger.info('Desactivando cliente (soft delete)', { cliente_id: this.id });
      
      // Verificar si tiene asignaciones activas
      const asignacionesActivas = await this.getProyectos({ estado: 'activa' });
      if (asignacionesActivas.length > 0) {
        throw new Error('No se puede eliminar cliente con asignaciones activas');
      }

      await this.changeStatus('inactivo');
      
      logger.info('Cliente desactivado exitosamente', { cliente_id: this.id });
      return true;
    } catch (error) {
      logger.error('Error al eliminar cliente:', error);
      throw error;
    }
  }

  // Convertir a JSON para respuestas API
  toJSON() {
    return {
      id: this.id,
      razon_social: this.razon_social,
      nombre_comercial: this.nombre_comercial,
      tipo_cliente: this.tipo_cliente,
      identificacion: this.identificacion,
      tipo_identificacion: this.tipo_identificacion,
      email: this.email,
      telefono: this.telefono,
      telefono_secundario: this.telefono_secundario,
      direccion: this.direccion,
      ciudad: this.ciudad,
      provincia: this.provincia,
      pais: this.pais,
      codigo_postal: this.codigo_postal,
      sitio_web: this.sitio_web,
      sector_industria: this.sector_industria,
      tamaño_empresa: this.tamaño_empresa,
      contacto_principal: this.contacto_principal,
      cargo_contacto: this.cargo_contacto,
      email_contacto: this.email_contacto,
      telefono_contacto: this.telefono_contacto,
      estado: this.estado,
      fecha_registro: this.fecha_registro,
      fecha_primer_proyecto: this.fecha_primer_proyecto,
      calificacion_cliente: this.calificacion_cliente,
      limite_credito: this.limite_credito,
      condiciones_pago: this.condiciones_pago,
      descuento_corporativo: this.descuento_corporativo,
      observaciones: this.observaciones,
      metadatos: this.metadatos,
      total_proyectos: this.total_proyectos,
      proyectos_activos: this.proyectos_activos,
      total_actividades: this.total_actividades,
      horas_facturadas: this.horas_facturadas,
      fecha_creacion: this.fecha_creacion,
      fecha_actualizacion: this.fecha_actualizacion
    };
  }
}

module.exports = Cliente;
