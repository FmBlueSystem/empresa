// Cliente.js - Modelo para gestión de clientes en Verifika
const db = require('../config/database');
const logger = require('../config/logger');

class Cliente {
  constructor(data) {
    this.id = data.id;
    this.razon_social = data.razon_social;
    this.nombre_comercial = data.nombre_comercial;
    this.tipo_cliente = data.tipo_cliente; // empresa, particular, gobierno
    this.identificacion = data.identificacion;
    this.tipo_identificacion = data.tipo_identificacion; // cedula, ruc, pasaporte
    this.email = data.email;
    this.telefono = data.telefono;
    this.telefono_secundario = data.telefono_secundario;
    this.direccion = data.direccion;
    this.ciudad = data.ciudad;
    this.provincia = data.provincia;
    this.pais = data.pais || 'Costa Rica';
    this.codigo_postal = data.codigo_postal;
    this.sitio_web = data.sitio_web;
    this.sector_industria = data.sector_industria;
    this.tamaño_empresa = data.tamaño_empresa; // pequeña, mediana, grande, corporativa
    this.contacto_principal = data.contacto_principal;
    this.cargo_contacto = data.cargo_contacto;
    this.email_contacto = data.email_contacto;
    this.telefono_contacto = data.telefono_contacto;
    this.estado = data.estado || 'activo'; // activo, inactivo, suspendido, prospecto
    this.fecha_registro = data.fecha_registro;
    this.fecha_primer_proyecto = data.fecha_primer_proyecto;
    this.calificacion_cliente = data.calificacion_cliente; // A, B, C, D
    this.limite_credito = data.limite_credito;
    this.condiciones_pago = data.condiciones_pago; // 15, 30, 45, 60 días
    this.descuento_corporativo = data.descuento_corporativo;
    this.observaciones = data.observaciones;
    this.metadatos = data.metadatos;
    this.creado_por = data.creado_por;
    this.fecha_creacion = data.fecha_creacion;
    this.fecha_actualizacion = data.fecha_actualizacion;
  }

  // Crear nuevo cliente
  static async create(clienteData, creadoPor = null) {
    try {
      logger.info('Creando nuevo cliente', { razon_social: clienteData.razon_social, creado_por: creadoPor });

      // Verificar si ya existe cliente con misma identificación
      if (clienteData.identificacion) {
        const existente = await this.findByIdentificacion(clienteData.identificacion);
        if (existente) {
          throw new Error(`Ya existe un cliente con identificación ${clienteData.identificacion}`);
        }
      }

      // Verificar email único
      if (clienteData.email) {
        const existenteEmail = await this.findByEmail(clienteData.email);
        if (existenteEmail) {
          throw new Error(`Ya existe un cliente con email ${clienteData.email}`);
        }
      }

      const query = `
        INSERT INTO vf_clientes (
          razon_social, nombre_comercial, tipo_cliente, identificacion, tipo_identificacion,
          email, telefono, telefono_secundario, direccion, ciudad, provincia, pais,
          codigo_postal, sitio_web, sector_industria, tamaño_empresa,
          contacto_principal, cargo_contacto, email_contacto, telefono_contacto,
          estado, calificacion_cliente, limite_credito, condiciones_pago,
          descuento_corporativo, observaciones, metadatos, creado_por,
          fecha_creacion, fecha_actualizacion
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `;

      const valores = [
        clienteData.razon_social,
        clienteData.nombre_comercial || clienteData.razon_social,
        clienteData.tipo_cliente || 'empresa',
        clienteData.identificacion,
        clienteData.tipo_identificacion || 'cedula',
        clienteData.email,
        clienteData.telefono,
        clienteData.telefono_secundario,
        clienteData.direccion,
        clienteData.ciudad,
        clienteData.provincia,
        clienteData.pais || 'Costa Rica',
        clienteData.codigo_postal,
        clienteData.sitio_web,
        clienteData.sector_industria,
        clienteData.tamaño_empresa || 'mediana',
        clienteData.contacto_principal,
        clienteData.cargo_contacto,
        clienteData.email_contacto,
        clienteData.telefono_contacto,
        clienteData.estado || 'activo',
        clienteData.calificacion_cliente || 'B',
        clienteData.limite_credito || 0,
        clienteData.condiciones_pago || 30,
        clienteData.descuento_corporativo || 0,
        clienteData.observaciones,
        clienteData.metadatos ? JSON.stringify(clienteData.metadatos) : null,
        creadoPor
      ];

      const [result] = await db.execute(query, valores);
      const cliente = await this.findById(result.insertId);

      logger.info('Cliente creado exitosamente', {
        cliente_id: result.insertId,
        razon_social: clienteData.razon_social,
        creado_por: creadoPor
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
        SELECT c.*, 
               COUNT(DISTINCT p.id) as total_proyectos,
               COUNT(DISTINCT p.id) FILTER (WHERE p.estado = 'activo') as proyectos_activos,
               COUNT(DISTINCT a.id) as total_actividades,
               SUM(CASE WHEN a.estado = 'completada' THEN a.horas_trabajadas ELSE 0 END) as horas_facturadas
        FROM vf_clientes c
        LEFT JOIN vf_proyectos p ON c.id = p.cliente_id
        LEFT JOIN vf_actividades a ON p.id = a.proyecto_id
        WHERE c.id = ?
        GROUP BY c.id
      `;

      const [rows] = await db.execute(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }

      const clienteData = rows[0];
      if (clienteData.metadatos) {
        try {
          clienteData.metadatos = JSON.parse(clienteData.metadatos);
        } catch (e) {
          clienteData.metadatos = {};
        }
      }

      return new Cliente(clienteData);
    } catch (error) {
      logger.error('Error al buscar cliente por ID:', error);
      throw error;
    }
  }

  // Buscar cliente por identificación
  static async findByIdentificacion(identificacion) {
    try {
      const query = 'SELECT * FROM vf_clientes WHERE identificacion = ? LIMIT 1';
      const [rows] = await db.execute(query, [identificacion]);
      
      if (rows.length === 0) {
        return null;
      }

      return new Cliente(rows[0]);
    } catch (error) {
      logger.error('Error al buscar cliente por identificación:', error);
      throw error;
    }
  }

  // Buscar cliente por email
  static async findByEmail(email) {
    try {
      const query = 'SELECT * FROM vf_clientes WHERE email = ? OR email_contacto = ? LIMIT 1';
      const [rows] = await db.execute(query, [email, email]);
      
      if (rows.length === 0) {
        return null;
      }

      return new Cliente(rows[0]);
    } catch (error) {
      logger.error('Error al buscar cliente por email:', error);
      throw error;
    }
  }

  // Listar clientes con filtros
  static async findAll(filtros = {}) {
    try {
      let query = `
        SELECT c.*, 
               COUNT(DISTINCT p.id) as total_proyectos,
               COUNT(DISTINCT p.id) FILTER (WHERE p.estado = 'activo') as proyectos_activos,
               SUM(CASE WHEN a.estado = 'completada' THEN a.horas_trabajadas ELSE 0 END) as horas_facturadas
        FROM vf_clientes c
        LEFT JOIN vf_proyectos p ON c.id = p.cliente_id
        LEFT JOIN vf_actividades a ON p.id = a.proyecto_id
      `;
      
      const condiciones = [];
      const valores = [];

      // Filtro por estado
      if (filtros.estado) {
        condiciones.push('c.estado = ?');
        valores.push(filtros.estado);
      }

      // Filtro por tipo de cliente
      if (filtros.tipo_cliente) {
        condiciones.push('c.tipo_cliente = ?');
        valores.push(filtros.tipo_cliente);
      }

      // Filtro por sector
      if (filtros.sector_industria) {
        condiciones.push('c.sector_industria = ?');
        valores.push(filtros.sector_industria);
      }

      // Filtro por tamaño empresa
      if (filtros.tamaño_empresa) {
        condiciones.push('c.tamaño_empresa = ?');
        valores.push(filtros.tamaño_empresa);
      }

      // Filtro por ciudad
      if (filtros.ciudad) {
        condiciones.push('c.ciudad LIKE ?');
        valores.push(`%${filtros.ciudad}%`);
      }

      // Búsqueda por texto
      if (filtros.search) {
        condiciones.push(`(
          c.razon_social LIKE ? OR 
          c.nombre_comercial LIKE ? OR 
          c.contacto_principal LIKE ? OR
          c.email LIKE ? OR
          c.identificacion LIKE ?
        )`);
        const searchTerm = `%${filtros.search}%`;
        valores.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
      }

      // Agregar condiciones WHERE
      if (condiciones.length > 0) {
        query += ' WHERE ' + condiciones.join(' AND ');
      }

      // GROUP BY
      query += ' GROUP BY c.id';

      // Ordenamiento
      const ordenValido = ['razon_social', 'fecha_creacion', 'estado', 'ciudad', 'total_proyectos'];
      const orden = ordenValido.includes(filtros.sort) ? filtros.sort : 'razon_social';
      const direccion = filtros.order === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${orden} ${direccion}`;

      // Paginación
      const limit = Math.min(parseInt(filtros.limit) || 20, 100);
      const offset = Math.max(parseInt(filtros.offset) || 0, 0);
      query += ' LIMIT ? OFFSET ?';
      valores.push(limit, offset);

      const [rows] = await db.execute(query, valores);

      return rows.map(row => {
        if (row.metadatos) {
          try {
            row.metadatos = JSON.parse(row.metadatos);
          } catch (e) {
            row.metadatos = {};
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
        SELECT c.*, 
               COUNT(DISTINCT p.id) as proyectos_activos
        FROM vf_clientes c
        LEFT JOIN vf_proyectos p ON c.id = p.cliente_id AND p.estado = 'activo'
        WHERE c.estado = 'activo'
        GROUP BY c.id
        ORDER BY c.razon_social ASC
      `;

      const [rows] = await db.execute(query);
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
        'razon_social', 'nombre_comercial', 'tipo_cliente', 'identificacion', 'tipo_identificacion',
        'email', 'telefono', 'telefono_secundario', 'direccion', 'ciudad', 'provincia', 'pais',
        'codigo_postal', 'sitio_web', 'sector_industria', 'tamaño_empresa',
        'contacto_principal', 'cargo_contacto', 'email_contacto', 'telefono_contacto',
        'calificacion_cliente', 'limite_credito', 'condiciones_pago',
        'descuento_corporativo', 'observaciones', 'metadatos'
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

      const query = `UPDATE vf_clientes SET ${actualizaciones.join(', ')} WHERE id = ?`;
      await db.execute(query, valores);

      // Actualizar propiedades del objeto
      Object.assign(this, datosActualizacion);

      logger.info('Cliente actualizado exitosamente', { cliente_id: this.id });
      return this;
    } catch (error) {
      logger.error('Error al actualizar cliente:', error);
      throw error;
    }
  }

  // Cambiar estado del cliente
  async changeStatus(nuevoEstado, usuarioId = null) {
    try {
      const estadosValidos = ['activo', 'inactivo', 'suspendido', 'prospecto'];
      if (!estadosValidos.includes(nuevoEstado)) {
        throw new Error(`Estado no válido: ${nuevoEstado}`);
      }

      logger.info('Cambiando estado de cliente', {
        cliente_id: this.id,
        estado_anterior: this.estado,
        estado_nuevo: nuevoEstado,
        usuario_id: usuarioId
      });

      const query = 'UPDATE vf_clientes SET estado = ?, fecha_actualizacion = NOW() WHERE id = ?';
      await db.execute(query, [nuevoEstado, this.id]);

      this.estado = nuevoEstado;

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
        query += ' LIMIT ? OFFSET ?';
        valores.push(limit, offset);
      }

      const [rows] = await db.execute(query, valores);
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

      const [rows] = await db.execute(query, [this.id]);
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
      const [existe] = await db.execute(existeQuery, [this.id, usuarioId]);

      if (existe.length > 0) {
        throw new Error('El usuario ya está asignado como validador de este cliente');
      }

      const query = `
        INSERT INTO vf_cliente_validadores (cliente_id, usuario_id, asignado_por, fecha_asignacion)
        VALUES (?, ?, ?, NOW())
      `;

      await db.execute(query, [this.id, usuarioId, asignadoPor]);

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

      const [rows] = await db.execute(query, [this.id]);
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
          COUNT(CASE WHEN estado = 'activo' THEN 1 END) as clientes_activos,
          COUNT(CASE WHEN estado = 'inactivo' THEN 1 END) as clientes_inactivos,
          COUNT(CASE WHEN estado = 'prospecto' THEN 1 END) as prospectos,
          COUNT(CASE WHEN tipo_cliente = 'empresa' THEN 1 END) as empresas,
          COUNT(CASE WHEN tipo_cliente = 'particular' THEN 1 END) as particulares,
          COUNT(CASE WHEN tipo_cliente = 'gobierno' THEN 1 END) as gobierno,
          AVG(limite_credito) as promedio_limite_credito,
          SUM(limite_credito) as total_limite_credito
        FROM vf_clientes
      `;

      const [rows] = await db.execute(query);
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
      
      // Verificar si tiene proyectos activos
      const proyectosActivos = await this.getProyectos({ estado: 'activo' });
      if (proyectosActivos.length > 0) {
        throw new Error('No se puede eliminar cliente con proyectos activos');
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
