const database = require('../config/database');
const mysql = require('mysql2/promise');

class Validacion {
  constructor(data) {
    this.id = data.id;
    this.actividad_id = data.actividad_id;
    this.validador_id = data.validador_id;
    this.tecnico_id = data.tecnico_id;
    this.cliente_id = data.cliente_id;
    
    // Estados expandidos
    this.estado = data.estado || 'pendiente_revision';
    this.estado_anterior = data.estado_anterior;
    
    // Scoring de calidad
    this.puntuacion_general = data.puntuacion_general;
    this.criterios_calidad = data.criterios_calidad ? JSON.parse(data.criterios_calidad) : {};
    
    // Plazos y escalamiento
    this.fecha_limite = data.fecha_limite;
    this.fecha_asignacion = data.fecha_asignacion;
    this.fecha_inicio_revision = data.fecha_inicio_revision;
    this.fecha_completada = data.fecha_completada;
    this.dias_plazo = data.dias_plazo || 3;
    this.escalada_automaticamente = data.escalada_automaticamente || false;
    this.supervisor_escalado_id = data.supervisor_escalado_id;
    
    // Feedback estructurado
    this.comentario_principal = data.comentario_principal;
    this.aspectos_positivos = data.aspectos_positivos ? JSON.parse(data.aspectos_positivos) : [];
    this.aspectos_mejora = data.aspectos_mejora ? JSON.parse(data.aspectos_mejora) : [];
    this.requerimientos_cambios = data.requerimientos_cambios ? JSON.parse(data.requerimientos_cambios) : [];
    this.impacto_negocio = data.impacto_negocio;
    
    // Metadatos
    this.tiempo_revision_horas = data.tiempo_revision_horas;
    this.complejidad_revision = data.complejidad_revision;
    this.satisfaccion_cliente = data.satisfaccion_cliente;
    
    // Auditoría
    this.creado_en = data.creado_en;
    this.actualizado_en = data.actualizado_en;
    
    // Información relacionada (joins)
    this.actividad_titulo = data.actividad_titulo;
    this.actividad_descripcion = data.actividad_descripcion;
    this.tecnico_nombre = data.tecnico_nombre;
    this.tecnico_apellidos = data.tecnico_apellidos;
    this.cliente_nombre = data.cliente_nombre;
    this.validador_nombre = data.validador_nombre;
    this.supervisor_nombre = data.supervisor_nombre;
  }

  // =============================================
  // MÉTODOS CRUD BÁSICOS
  // =============================================

  /**
   * Crear nueva validación con configuración automática de plazos
   */
  static async create(validacionData) {
    const connection = await database.getConnection();
    
    try {
      await connection.beginTransaction();

      // Validar que la actividad existe
      await this.validateActividad(validacionData.actividad_id, connection);

      const query = `
        INSERT INTO vf_validaciones (
          actividad_id, validador_id, estado, comentarios,
          horas_aprobadas, monto_aprobado, archivos_validacion,
          requiere_segunda_validacion, validacion_padre_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        validacionData.actividad_id,
        validacionData.validador_id,
        validacionData.estado || 'pendiente_revision',
        validacionData.comentarios || null,
        validacionData.horas_aprobadas || null,
        validacionData.monto_aprobado || null,
        JSON.stringify(validacionData.archivos_validacion || []),
        validacionData.requiere_segunda_validacion ? 1 : 0,
        validacionData.validacion_padre_id || null
      ];

      const result = await connection.query(query, values);
      await connection.commit();

      const insertId = Array.isArray(result) ? result[0].insertId : result.insertId;

      // Obtener la validación creada
      const nuevaValidacion = await this.findById(insertId);
      
      return nuevaValidacion;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Buscar validación por ID con información relacionada
   */
  static async findById(id) {
    const query = `
      SELECT 
        v.*,
        a.titulo as actividad_titulo,
        a.descripcion as actividad_descripcion,
        a.tipo_actividad,
        t.nombre as tecnico_nombre,
        t.apellidos as tecnico_apellidos,
        c.nombre as cliente_nombre,
        val.nombre as validador_nombre,
        sup.nombre as supervisor_nombre
      FROM vf_validaciones v
      LEFT JOIN vf_actividades a ON v.actividad_id = a.id
      LEFT JOIN vf_tecnicos t ON v.tecnico_id = t.id
      LEFT JOIN vf_clientes c ON v.cliente_id = c.id
      LEFT JOIN vf_usuarios val ON v.validador_id = val.id
      LEFT JOIN vf_usuarios sup ON v.supervisor_escalado_id = sup.id
      WHERE v.id = ?
    `;

    const rows = await database.query(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }

    return new Validacion(rows[0]);
  }

  /**
   * Buscar todas las validaciones con filtros avanzados
   */
  static async findAll(filtros = {}, paginacion = {}) {
    let query = `
      SELECT 
        v.*,
        a.titulo as actividad_titulo,
        a.descripcion as actividad_descripcion,
        a.tipo_actividad,
        t.nombre as tecnico_nombre,
        t.apellidos as tecnico_apellidos,
        c.nombre as cliente_nombre,
        val.nombre as validador_nombre,
        sup.nombre as supervisor_nombre
      FROM vf_validaciones v
      LEFT JOIN vf_actividades a ON v.actividad_id = a.id
      LEFT JOIN vf_tecnicos t ON v.tecnico_id = t.id
      LEFT JOIN vf_clientes c ON v.cliente_id = c.id
      LEFT JOIN vf_usuarios val ON v.validador_id = val.id
      LEFT JOIN vf_usuarios sup ON v.supervisor_escalado_id = sup.id
      WHERE 1=1
    `;

    const valores = [];

    // Aplicar filtros
    if (filtros.actividad_id) {
      query += ` AND v.actividad_id = ?`;
      valores.push(filtros.actividad_id);
    }

    if (filtros.validador_id) {
      query += ` AND v.validador_id = ?`;
      valores.push(filtros.validador_id);
    }

    if (filtros.tecnico_id) {
      query += ` AND v.tecnico_id = ?`;
      valores.push(filtros.tecnico_id);
    }

    if (filtros.cliente_id) {
      query += ` AND v.cliente_id = ?`;
      valores.push(filtros.cliente_id);
    }

    if (filtros.estado) {
      if (Array.isArray(filtros.estado)) {
        query += ` AND v.estado IN (${filtros.estado.map(() => '?').join(',')})`;
        valores.push(...filtros.estado);
      } else {
        query += ` AND v.estado = ?`;
        valores.push(filtros.estado);
      }
    }

    if (filtros.fecha_desde) {
      query += ` AND v.fecha_asignacion >= ?`;
      valores.push(filtros.fecha_desde);
    }

    if (filtros.fecha_hasta) {
      query += ` AND v.fecha_asignacion <= ?`;
      valores.push(filtros.fecha_hasta);
    }

    if (filtros.proximas_vencer) {
      query += ` AND v.fecha_limite <= DATE_ADD(NOW(), INTERVAL 1 DAY) AND v.estado IN ('pendiente_revision', 'en_revision')`;
    }

    if (filtros.vencidas) {
      query += ` AND v.fecha_limite < NOW() AND v.estado IN ('pendiente_revision', 'en_revision')`;
    }

    if (filtros.escaladas) {
      query += ` AND v.escalada_automaticamente = 1`;
    }

    if (filtros.search) {
      query += ` AND (a.titulo LIKE ? OR a.descripcion LIKE ? OR v.comentario_principal LIKE ?)`;
      const searchTerm = `%${filtros.search}%`;
      valores.push(searchTerm, searchTerm, searchTerm);
    }

    // Ordenamiento
    const ordenValido = ['fecha_asignacion', 'fecha_limite', 'estado', 'puntuacion_general', 'creado_en'];
    const direccionValida = ['ASC', 'DESC'];
    
    if (filtros.orden && ordenValido.includes(filtros.orden)) {
      const direccion = direccionValida.includes(filtros.direccion?.toUpperCase()) ? filtros.direccion.toUpperCase() : 'DESC';
      query += ` ORDER BY v.${filtros.orden} ${direccion}`;
    } else {
      query += ` ORDER BY v.fecha_asignacion DESC`;
    }

    // Paginación
    if (paginacion.limit) {
      const limit = parseInt(paginacion.limit);
      const offset = parseInt(paginacion.offset) || 0;
      query += ' LIMIT ? OFFSET ?';
      valores.push(limit, offset);
    }

    const rows = await database.query(query, valores);
    return rows.map(row => new Validacion(row));
  }

  /**
   * Actualizar validación
   */
  async update(datosActualizacion) {
    const connection = await database.getConnection();
    
    try {
      await connection.beginTransaction();

      // Construir query de actualización dinámico
      const camposActualizables = [
        'estado', 'comentarios', 'horas_aprobadas', 'monto_aprobado',
        'archivos_validacion', 'requiere_segunda_validacion', 'validacion_padre_id'
      ];

      const updates = [];
      const valores = [];

      for (const campo of camposActualizables) {
        if (Object.prototype.hasOwnProperty.call(datosActualizacion, campo)) {
          updates.push(`${campo} = ?`);
          
          // Serializar JSON si es necesario
          if (campo === 'archivos_validacion') {
            valores.push(JSON.stringify(datosActualizacion[campo]));
          } else if (campo === 'requiere_segunda_validacion') {
            valores.push(datosActualizacion[campo] ? 1 : 0);
          } else {
            valores.push(datosActualizacion[campo]);
          }
        }
      }

      if (updates.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      valores.push(this.id);

      const query = `UPDATE vf_validaciones SET ${updates.join(', ')} WHERE id = ?`;
      await connection.query(query, valores);

      await connection.commit();

      // Actualizar el objeto actual
      Object.assign(this, datosActualizacion);

      return this;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // =============================================
  // MÉTODOS DE WORKFLOW
  // =============================================

  /**
   * Validar (aprobar) actividad
   */
  async validar(validadorId, datosValidacion) {
    const connection = await database.getConnection();
    
    try {
      await connection.beginTransaction();

      const updates = {
        estado: 'aprobada',
        comentarios: datosValidacion.comentarios,
        horas_aprobadas: datosValidacion.horas_aprobadas,
        monto_aprobado: datosValidacion.monto_aprobado
      };

      await this.update(updates);

      // Actualizar estado de la actividad
      await connection.query(
        'UPDATE vf_actividades SET estado = ? WHERE id = ?',
        ['validada', this.actividad_id]
      );

      await connection.commit();
      return this;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Rechazar actividad con feedback
   */
  async rechazar(validadorId, datosRechazo) {
    const connection = await database.getConnection();
    
    try {
      await connection.beginTransaction();

      const updates = {
        estado: 'rechazada',
        comentarios: datosRechazo.comentarios,
        horas_aprobadas: 0
      };

      await this.update(updates);

      // Actualizar estado de la actividad
      await connection.query(
        'UPDATE vf_actividades SET estado = ? WHERE id = ?',
        ['rechazada', this.actividad_id]
      );

      await connection.commit();
      return this;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Escalar validación a supervisor
   */
  async escalar(supervisorId, razonEscalamiento) {
    const updates = {
      estado_anterior: this.estado,
      estado: 'escalada',
      escalada_automaticamente: false,
      supervisor_escalado_id: supervisorId,
      fecha_limite: this.calculateFechaLimite(2) // 2 días adicionales para supervisor
    };

    await this.update(updates);

    // Crear notificación para el supervisor
    await this.createNotificacion(
      supervisorId,
      'escalamiento',
      'Validación escalada',
      `Se ha escalado la validación de "${this.actividad_titulo}": ${razonEscalamiento}`,
      'validacion',
      this.id
    );

    return this;
  }

  /**
   * Reabrir validación (solo admin)
   */
  async reabrir(motivoReapertura) {
    const updates = {
      estado_anterior: this.estado,
      estado: 'reabierta',
      fecha_completada: null,
      fecha_limite: this.calculateFechaLimite(this.dias_plazo),
      comentario_principal: `${this.comentario_principal}\n\n[REABIERTA] ${motivoReapertura}`
    };

    await this.update(updates);

    // Notificar al validador original
    await this.createNotificacion(
      this.validador_id,
      'validacion',
      'Validación reabierta',
      `La validación de "${this.actividad_titulo}" ha sido reabierta: ${motivoReapertura}`,
      'validacion',
      this.id
    );

    return this;
  }

  /**
   * Iniciar revisión (cambiar estado cuando el validador comienza)
   */
  async iniciarRevision() {
    const updates = {
      estado_anterior: this.estado,
      estado: 'en_revision',
      fecha_inicio_revision: new Date()
    };

    await this.update(updates);
    return this;
  }

  // =============================================
  // ESCALAMIENTO AUTOMÁTICO
  // =============================================

  /**
   * Verificar y ejecutar escalamientos automáticos por tiempo vencido
   */
  static async procesarEscalamientosAutomaticos() {
    const validacionesVencidas = await this.findAll({
      vencidas: true,
      estado: ['pendiente_revision', 'en_revision']
    });

    let escaladasCount = 0;

    for (const validacion of validacionesVencidas) {
      if (!validacion.escalada_automaticamente) {
        // Buscar supervisor del cliente
        const supervisor = await this.findSupervisorCliente(validacion.cliente_id);
        
        if (supervisor) {
          await validacion.escalarAutomaticamente(supervisor.id);
          escaladasCount++;
        }
      }
    }

    return {
      validaciones_procesadas: validacionesVencidas.length,
      escaladas: escaladasCount
    };
  }

  /**
   * Escalar automáticamente por tiempo vencido
   */
  async escalarAutomaticamente(supervisorId) {
    const updates = {
      estado_anterior: this.estado,
      estado: 'escalada',
      escalada_automaticamente: true,
      supervisor_escalado_id: supervisorId,
      fecha_limite: this.calculateFechaLimite(1) // 1 día adicional urgente
    };

    await this.update(updates);

    // Notificar escalamiento automático
    await this.createNotificacion(
      supervisorId,
      'escalamiento',
      'Escalamiento automático',
      `Validación vencida escalada automáticamente: "${this.actividad_titulo}"`,
      'validacion',
      this.id
    );

    // Notificar al validador original sobre el escalamiento
    await this.createNotificacion(
      this.validador_id,
      'plazo',
      'Validación escalada por tiempo vencido',
      `Tu validación de "${this.actividad_titulo}" ha sido escalada por exceder el plazo`,
      'validacion',
      this.id
    );

    return this;
  }

  // =============================================
  // REPORTES Y MÉTRICAS
  // =============================================

  /**
   * Obtener dashboard de validaciones para un cliente
   */
  static async getDashboard(clienteId = null) {
    let whereClause = '';
    const valores = [];

    if (clienteId) {
      whereClause = 'WHERE cliente_id = ?';
      valores.push(clienteId);
    }

    const query = `
      SELECT 
        COUNT(*) as total_validaciones,
        COUNT(CASE WHEN estado = 'pendiente_revision' THEN 1 END) as pendientes_revision,
        COUNT(CASE WHEN estado = 'en_revision' THEN 1 END) as en_revision,
        COUNT(CASE WHEN estado = 'validada' THEN 1 END) as validadas,
        COUNT(CASE WHEN estado = 'rechazada' THEN 1 END) as rechazadas,
        COUNT(CASE WHEN estado = 'escalada' THEN 1 END) as escaladas,
        COUNT(CASE WHEN fecha_completada >= CURDATE() THEN 1 END) as completadas_hoy,
        COUNT(CASE WHEN fecha_limite <= DATE_ADD(NOW(), INTERVAL 1 DAY) AND estado IN ('pendiente_revision', 'en_revision') THEN 1 END) as proximas_vencer,
        COUNT(CASE WHEN fecha_limite < NOW() AND estado IN ('pendiente_revision', 'en_revision') THEN 1 END) as vencidas,
        AVG(tiempo_revision_horas) as promedio_tiempo_revision,
        AVG(puntuacion_general) as puntuacion_promedio,
        AVG(satisfaccion_cliente) as satisfaccion_promedio,
        COUNT(CASE WHEN estado = 'validada' THEN 1 END) / COUNT(CASE WHEN estado IN ('validada', 'rechazada') THEN 1 END) * 100 as tasa_aprobacion
      FROM vf_validaciones 
      ${whereClause}
    `;

    const rows = await database.query(query, valores);
    return rows[0];
  }

  /**
   * Obtener reporte de calidad por técnico
   */
  static async getReporteCalidad(filtros = {}) {
    let whereClause = 'WHERE v.estado IN ("validada", "rechazada")';
    const valores = [];

    if (filtros.tecnico_id) {
      whereClause += ' AND v.tecnico_id = ?';
      valores.push(filtros.tecnico_id);
    }

    if (filtros.cliente_id) {
      whereClause += ' AND v.cliente_id = ?';
      valores.push(filtros.cliente_id);
    }

    if (filtros.fecha_desde) {
      whereClause += ' AND v.fecha_completada >= ?';
      valores.push(filtros.fecha_desde);
    }

    if (filtros.fecha_hasta) {
      whereClause += ' AND v.fecha_completada <= ?';
      valores.push(filtros.fecha_hasta);
    }

    const query = `
      SELECT 
        t.nombre,
        t.apellidos,
        COUNT(*) as total_validaciones,
        COUNT(CASE WHEN v.estado = 'validada' THEN 1 END) as aprobadas,
        COUNT(CASE WHEN v.estado = 'rechazada' THEN 1 END) as rechazadas,
        AVG(v.puntuacion_general) as puntuacion_promedio,
        AVG(v.satisfaccion_cliente) as satisfaccion_promedio,
        COUNT(CASE WHEN v.estado = 'validada' THEN 1 END) / COUNT(*) * 100 as tasa_aprobacion,
        AVG(v.tiempo_revision_horas) as tiempo_revision_promedio,
        COUNT(CASE WHEN v.escalada_automaticamente = 1 THEN 1 END) as escalamientos_automaticos
      FROM vf_validaciones v
      JOIN vf_tecnicos t ON v.tecnico_id = t.id
      ${whereClause}
      GROUP BY v.tecnico_id, t.nombre, t.apellidos
      ORDER BY puntuacion_promedio DESC
    `;

    const rows = await database.query(query, valores);
    return rows;
  }

  /**
   * Obtener tendencias de validación
   */
  static async getTendenciasValidacion(periodo = '30') {
    const query = `
      SELECT 
        DATE(fecha_completada) as fecha,
        COUNT(*) as total_validaciones,
        COUNT(CASE WHEN estado = 'validada' THEN 1 END) as aprobadas,
        COUNT(CASE WHEN estado = 'rechazada' THEN 1 END) as rechazadas,
        AVG(puntuacion_general) as puntuacion_promedio,
        AVG(tiempo_revision_horas) as tiempo_promedio
      FROM vf_validaciones 
      WHERE fecha_completada >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
        AND estado IN ('validada', 'rechazada')
      GROUP BY DATE(fecha_completada)
      ORDER BY fecha DESC
    `;

    const rows = await database.query(query, [parseInt(periodo)]);
    return rows;
  }

  // =============================================
  // MÉTODOS DE UTILIDAD
  // =============================================

  /**
   * Calcular fecha límite basada en días de plazo
   */
  static calculateFechaLimite(diasPlazo) {
    const fecha = new Date();
    fecha.setDate(fecha.getDate() + diasPlazo);
    // Ajustar por días laborables si es necesario
    return fecha;
  }

  /**
   * Calcular tiempo de revisión en horas
   */
  calculateTiempoRevision() {
    if (!this.fecha_inicio_revision) return 0;

    const inicio = new Date(this.fecha_inicio_revision);
    const fin = new Date();
    const diferencia = fin.getTime() - inicio.getTime();
    return Math.round((diferencia / (1000 * 60 * 60)) * 100) / 100;
  }

  /**
   * Verificar si está vencida
   */
  isVencida() {
    return this.fecha_limite && new Date() > new Date(this.fecha_limite) && 
           ['pendiente_revision', 'en_revision'].includes(this.estado);
  }

  /**
   * Verificar si está próxima a vencer (menos de 1 día)
   */
  isProximaVencer() {
    if (!this.fecha_limite || !['pendiente_revision', 'en_revision'].includes(this.estado)) {
      return false;
    }
    
    const ahora = new Date();
    const limite = new Date(this.fecha_limite);
    const diferencia = limite.getTime() - ahora.getTime();
    const horasRestantes = diferencia / (1000 * 60 * 60);
    
    return horasRestantes > 0 && horasRestantes <= 24;
  }

  // =============================================
  // VALIDACIONES INTERNAS
  // =============================================

  /**
   * Validar que la actividad existe y está completada
   */
  static async validateActividad(actividadId, connection = null) {
    const conn = connection || database;
    
    const query = `
      SELECT id, estado, tecnico_id, titulo
      FROM vf_actividades 
      WHERE id = ? AND estado = 'completada'
    `;

    const rows = await conn.query(query, [actividadId]);
    
    if (rows.length === 0) {
      throw new Error('La actividad no existe o no está completada');
    }

    return rows[0];
  }

  /**
   * Validar que el validador tiene permisos sobre el cliente
   */
  static async validateValidadorPermiso(validadorId, clienteId, connection = null) {
    const conn = connection || database;
    
    // Por ahora, permitir validación a admins y usuarios del cliente
    const query = `
      SELECT u.id, u.rol, u.cliente_id
      FROM vf_usuarios u 
      WHERE u.id = ? AND (u.esAdmin = 1 OR u.cliente_id = ?)
    `;

    const rows = await conn.query(query, [validadorId, clienteId]);
    
    if (rows.length === 0) {
      throw new Error('El validador no tiene permisos sobre este cliente');
    }

    return true;
  }

  /**
   * Buscar supervisor de un cliente
   */
  static async findSupervisorCliente(clienteId) {
    const query = `
      SELECT id, nombre, email
      FROM vf_usuarios 
      WHERE cliente_id = ? AND rol = 'supervisor'
      LIMIT 1
    `;

    const rows = await database.query(query, [clienteId]);
    return rows[0] || null;
  }

  /**
   * Crear notificación
   */
  static async createNotificacion(usuarioId, tipo, titulo, mensaje, entidadTipo, entidadId) {
    const query = `
      INSERT INTO vf_notificaciones (usuario_id, tipo, titulo, mensaje, entidad_tipo, entidad_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await database.query(query, [usuarioId, tipo, titulo, mensaje, entidadTipo, entidadId]);
  }

  /**
   * Obtener información completa para API
   */
  toJSON() {
    return {
      id: this.id,
      actividad_id: this.actividad_id,
      validador_id: this.validador_id,
      tecnico_id: this.tecnico_id,
      cliente_id: this.cliente_id,
      
      // Estados
      estado: this.estado,
      estado_anterior: this.estado_anterior,
      
      // Scoring
      puntuacion_general: this.puntuacion_general,
      criterios_calidad: this.criterios_calidad,
      
      // Plazos
      fecha_limite: this.fecha_limite,
      fecha_asignacion: this.fecha_asignacion,
      fecha_inicio_revision: this.fecha_inicio_revision,
      fecha_completada: this.fecha_completada,
      dias_plazo: this.dias_plazo,
      escalada_automaticamente: this.escalada_automaticamente,
      supervisor_escalado_id: this.supervisor_escalado_id,
      
      // Feedback
      comentario_principal: this.comentario_principal,
      aspectos_positivos: this.aspectos_positivos,
      aspectos_mejora: this.aspectos_mejora,
      requerimientos_cambios: this.requerimientos_cambios,
      impacto_negocio: this.impacto_negocio,
      
      // Metadatos
      tiempo_revision_horas: this.tiempo_revision_horas,
      complejidad_revision: this.complejidad_revision,
      satisfaccion_cliente: this.satisfaccion_cliente,
      
      // Estados calculados
      vencida: this.isVencida(),
      proxima_vencer: this.isProximaVencer(),
      
      // Auditoría
      creado_en: this.creado_en,
      actualizado_en: this.actualizado_en,
      
      // Información relacionada
      actividad_titulo: this.actividad_titulo,
      actividad_descripcion: this.actividad_descripcion,
      tecnico_nombre: this.tecnico_nombre,
      tecnico_apellidos: this.tecnico_apellidos,
      cliente_nombre: this.cliente_nombre,
      validador_nombre: this.validador_nombre,
      supervisor_nombre: this.supervisor_nombre
    };
  }
}

module.exports = Validacion;
