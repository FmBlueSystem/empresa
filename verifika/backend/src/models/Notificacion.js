const db = require('../config/database');
const mysql = require('mysql2/promise');

class Notificacion {
  constructor(data) {
    this.id = data.id;
    this.usuario_id = data.usuario_id;
    
    // Contenido
    this.titulo = data.titulo;
    this.mensaje = data.mensaje;
    this.tipo = data.tipo;
    
    // Contexto
    this.entidad_tipo = data.entidad_tipo;
    this.entidad_id = data.entidad_id;
    
    // Estado
    this.leida = data.leida || false;
    this.fecha_lectura = data.fecha_lectura;
    
    // Configuración
    this.canal = data.canal || 'inapp';
    this.enviada = data.enviada || false;
    this.fecha_envio = data.fecha_envio;
    
    // Metadata
    this.metadata = data.metadata ? JSON.parse(data.metadata) : {};
    
    // Auditoría
    this.creado_en = data.creado_en;
    
    // Información relacionada (joins)
    this.usuario_nombre = data.usuario_nombre;
    this.usuario_email = data.usuario_email;
  }

  // =============================================
  // MÉTODOS CRUD BÁSICOS
  // =============================================

  /**
   * Crear nueva notificación
   */
  static async create(notificacionData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const query = `
        INSERT INTO vf_notificaciones (
          usuario_id, titulo, mensaje, tipo, entidad_tipo, entidad_id,
          canal, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        notificacionData.usuario_id,
        notificacionData.titulo,
        notificacionData.mensaje,
        notificacionData.tipo,
        notificacionData.entidad_tipo,
        notificacionData.entidad_id,
        notificacionData.canal || 'inapp',
        JSON.stringify(notificacionData.metadata || {})
      ];

      const [result] = await connection.execute(query, values);
      
      await connection.commit();

      // Obtener la notificación creada
      const nuevaNotificacion = await this.findById(result.insertId);
      
      return nuevaNotificacion;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Buscar notificación por ID
   */
  static async findById(id) {
    const query = `
      SELECT 
        n.*,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM vf_notificaciones n
      LEFT JOIN vf_usuarios u ON n.usuario_id = u.id
      WHERE n.id = ?
    `;

    const [rows] = await db.execute(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }

    return new Notificacion(rows[0]);
  }

  /**
   * Buscar todas las notificaciones con filtros
   */
  static async findAll(filtros = {}, paginacion = {}) {
    let query = `
      SELECT 
        n.*,
        u.nombre as usuario_nombre,
        u.email as usuario_email
      FROM vf_notificaciones n
      LEFT JOIN vf_usuarios u ON n.usuario_id = u.id
      WHERE 1=1
    `;

    const valores = [];

    // Aplicar filtros
    if (filtros.usuario_id) {
      query += ` AND n.usuario_id = ?`;
      valores.push(filtros.usuario_id);
    }

    if (filtros.tipo) {
      if (Array.isArray(filtros.tipo)) {
        query += ` AND n.tipo IN (${filtros.tipo.map(() => '?').join(',')})`;
        valores.push(...filtros.tipo);
      } else {
        query += ` AND n.tipo = ?`;
        valores.push(filtros.tipo);
      }
    }

    if (filtros.leida !== undefined) {
      query += ` AND n.leida = ?`;
      valores.push(filtros.leida);
    }

    if (filtros.canal) {
      query += ` AND n.canal = ?`;
      valores.push(filtros.canal);
    }

    if (filtros.entidad_tipo) {
      query += ` AND n.entidad_tipo = ?`;
      valores.push(filtros.entidad_tipo);
    }

    if (filtros.entidad_id) {
      query += ` AND n.entidad_id = ?`;
      valores.push(filtros.entidad_id);
    }

    if (filtros.fecha_desde) {
      query += ` AND n.creado_en >= ?`;
      valores.push(filtros.fecha_desde);
    }

    if (filtros.fecha_hasta) {
      query += ` AND n.creado_en <= ?`;
      valores.push(filtros.fecha_hasta);
    }

    if (filtros.search) {
      query += ` AND (n.titulo LIKE ? OR n.mensaje LIKE ?)`;
      const searchTerm = `%${filtros.search}%`;
      valores.push(searchTerm, searchTerm);
    }

    // Ordenamiento
    const ordenValido = ['creado_en', 'fecha_lectura', 'tipo'];
    const direccionValida = ['ASC', 'DESC'];
    
    if (filtros.orden && ordenValido.includes(filtros.orden)) {
      const direccion = direccionValida.includes(filtros.direccion?.toUpperCase()) ? filtros.direccion.toUpperCase() : 'DESC';
      query += ` ORDER BY n.${filtros.orden} ${direccion}`;
    } else {
      query += ` ORDER BY n.creado_en DESC`;
    }

    // Paginación
    if (paginacion.limit) {
      query += ` LIMIT ?`;
      valores.push(parseInt(paginacion.limit));
      
      if (paginacion.offset) {
        query += ` OFFSET ?`;
        valores.push(parseInt(paginacion.offset));
      }
    }

    const [rows] = await db.execute(query, valores);
    return rows.map(row => new Notificacion(row));
  }

  /**
   * Actualizar notificación
   */
  async update(datosActualizacion) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Construir query de actualización dinámico
      const camposActualizables = [
        'titulo', 'mensaje', 'leida', 'fecha_lectura', 'enviada', 
        'fecha_envio', 'metadata'
      ];

      const updates = [];
      const valores = [];

        for (const campo of camposActualizables) {
          if (Object.prototype.hasOwnProperty.call(datosActualizacion, campo)) {
          updates.push(`${campo} = ?`);
          
          if (campo === 'metadata') {
            valores.push(JSON.stringify(datosActualizacion[campo]));
          } else {
            valores.push(datosActualizacion[campo]);
          }
        }
      }

      if (updates.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      valores.push(this.id);

      const query = `UPDATE vf_notificaciones SET ${updates.join(', ')} WHERE id = ?`;
      await connection.execute(query, valores);

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

  /**
   * Eliminar notificación
   */
  async delete() {
    const query = `DELETE FROM vf_notificaciones WHERE id = ?`;
    await db.execute(query, [this.id]);
    return true;
  }

  // =============================================
  // MÉTODOS ESPECIALIZADOS
  // =============================================

  /**
   * Marcar como leída
   */
  async marcarComoLeida() {
    await this.update({
      leida: true,
      fecha_lectura: new Date()
    });
    return this;
  }

  /**
   * Marcar como no leída
   */
  async marcarComoNoLeida() {
    await this.update({
      leida: false,
      fecha_lectura: null
    });
    return this;
  }

  /**
   * Marcar como enviada
   */
  async marcarComoEnviada() {
    await this.update({
      enviada: true,
      fecha_envio: new Date()
    });
    return this;
  }

  // =============================================
  // MÉTODOS DE BÚSQUEDA ESPECIALIZADOS
  // =============================================

  /**
   * Obtener notificaciones no leídas por usuario
   */
  static async findUnreadByUser(usuarioId, limit = 50) {
    return this.findAll({
      usuario_id: usuarioId,
      leida: false
    }, { limit });
  }

  /**
   * Obtener notificaciones por tipo
   */
  static async findByType(tipo, usuarioId = null, limit = 20) {
    const filtros = { tipo };
    if (usuarioId) {
      filtros.usuario_id = usuarioId;
    }
    
    return this.findAll(filtros, { limit });
  }

  /**
   * Obtener notificaciones por entidad
   */
  static async findByEntity(entidadTipo, entidadId, usuarioId = null) {
    const filtros = { 
      entidad_tipo: entidadTipo,
      entidad_id: entidadId
    };
    
    if (usuarioId) {
      filtros.usuario_id = usuarioId;
    }
    
    return this.findAll(filtros);
  }

  /**
   * Obtener notificaciones pendientes de envío
   */
  static async findPendingToSend(canal = null) {
    const filtros = { enviada: false };
    if (canal) {
      filtros.canal = canal;
    }
    
    return this.findAll(filtros);
  }

  // =============================================
  // MÉTODOS MASIVOS
  // =============================================

  /**
   * Marcar múltiples notificaciones como leídas
   */
  static async markMultipleAsRead(notificacionIds, usuarioId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      const placeholders = notificacionIds.map(() => '?').join(',');
      const query = `
        UPDATE vf_notificaciones 
        SET leida = 1, fecha_lectura = NOW() 
        WHERE id IN (${placeholders}) AND usuario_id = ?
      `;
      
      const valores = [...notificacionIds, usuarioId];
      await connection.execute(query, valores);

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Marcar todas las notificaciones como leídas para un usuario
   */
  static async markAllAsReadForUser(usuarioId) {
    const query = `
      UPDATE vf_notificaciones 
      SET leida = 1, fecha_lectura = NOW() 
      WHERE usuario_id = ? AND leida = 0
    `;
    
    const [result] = await db.execute(query, [usuarioId]);
    return result.affectedRows;
  }

  /**
   * Eliminar notificaciones antiguas
   */
  static async deleteOldNotifications(diasAntiguedad = 90) {
    const query = `
      DELETE FROM vf_notificaciones 
      WHERE creado_en < DATE_SUB(NOW(), INTERVAL ? DAY)
        AND leida = 1
    `;
    
    const [result] = await db.execute(query, [diasAntiguedad]);
    return result.affectedRows;
  }

  // =============================================
  // ESTADÍSTICAS Y REPORTES
  // =============================================

  /**
   * Obtener estadísticas de notificaciones por usuario
   */
  static async getStatsForUser(usuarioId) {
    const query = `
      SELECT 
        COUNT(*) as total_notificaciones,
        COUNT(CASE WHEN leida = 0 THEN 1 END) as no_leidas,
        COUNT(CASE WHEN leida = 1 THEN 1 END) as leidas,
        COUNT(CASE WHEN tipo = 'validacion' THEN 1 END) as validaciones,
        COUNT(CASE WHEN tipo = 'comentario' THEN 1 END) as comentarios,
        COUNT(CASE WHEN tipo = 'escalamiento' THEN 1 END) as escalamientos,
        COUNT(CASE WHEN tipo = 'plazo' THEN 1 END) as plazos,
        COUNT(CASE WHEN creado_en >= CURDATE() THEN 1 END) as hoy,
        COUNT(CASE WHEN creado_en >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as semana
      FROM vf_notificaciones 
      WHERE usuario_id = ?
    `;

    const [rows] = await db.execute(query, [usuarioId]);
    return rows[0];
  }

  /**
   * Obtener estadísticas globales de notificaciones
   */
  static async getGlobalStats() {
    const query = `
      SELECT 
        COUNT(*) as total_notificaciones,
        COUNT(CASE WHEN leida = 0 THEN 1 END) as no_leidas,
        COUNT(CASE WHEN enviada = 0 THEN 1 END) as pendientes_envio,
        COUNT(CASE WHEN tipo = 'validacion' THEN 1 END) as validaciones,
        COUNT(CASE WHEN tipo = 'comentario' THEN 1 END) as comentarios,
        COUNT(CASE WHEN tipo = 'escalamiento' THEN 1 END) as escalamientos,
        COUNT(CASE WHEN canal = 'email' THEN 1 END) as por_email,
        COUNT(CASE WHEN canal = 'sms' THEN 1 END) as por_sms,
        COUNT(CASE WHEN creado_en >= CURDATE() THEN 1 END) as hoy,
        AVG(CASE WHEN leida = 1 AND fecha_lectura IS NOT NULL THEN 
            TIMESTAMPDIFF(MINUTE, creado_en, fecha_lectura) END) as tiempo_promedio_lectura_minutos
      FROM vf_notificaciones
    `;

    const [rows] = await db.execute(query);
    return rows[0];
  }

  /**
   * Obtener ranking de usuarios más notificados
   */
  static async getUserNotificationRanking(limit = 10) {
    const query = `
      SELECT 
        u.nombre,
        u.email,
        u.rol,
        COUNT(n.id) as total_notificaciones,
        COUNT(CASE WHEN n.leida = 0 THEN 1 END) as no_leidas,
        COUNT(CASE WHEN n.creado_en >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) THEN 1 END) as semana_actual
      FROM vf_usuarios u
      LEFT JOIN vf_notificaciones n ON u.id = n.usuario_id
      GROUP BY u.id, u.nombre, u.email, u.rol
      HAVING total_notificaciones > 0
      ORDER BY total_notificaciones DESC
      LIMIT ?
    `;

    const [rows] = await db.execute(query, [limit]);
    return rows;
  }

  // =============================================
  // UTILIDADES DE CREACIÓN RÁPIDA
  // =============================================

  /**
   * Crear notificación de validación
   */
  static async createValidacionNotification(usuarioId, titulo, mensaje, entidadId, canal = 'inapp') {
    return this.create({
      usuario_id: usuarioId,
      titulo,
      mensaje,
      tipo: 'validacion',
      entidad_tipo: 'validacion',
      entidad_id: entidadId,
      canal,
      metadata: {
        categoria: 'workflow',
        prioridad: 'normal'
      }
    });
  }

  /**
   * Crear notificación de comentario
   */
  static async createComentarioNotification(usuarioId, titulo, mensaje, comentarioId, canal = 'inapp') {
    return this.create({
      usuario_id: usuarioId,
      titulo,
      mensaje,
      tipo: 'comentario',
      entidad_tipo: 'comentario',
      entidad_id: comentarioId,
      canal,
      metadata: {
        categoria: 'social',
        prioridad: 'normal'
      }
    });
  }

  /**
   * Crear notificación de escalamiento
   */
  static async createEscalamientoNotification(usuarioId, titulo, mensaje, validacionId, urgencia = 'normal') {
    return this.create({
      usuario_id: usuarioId,
      titulo,
      mensaje,
      tipo: 'escalamiento',
      entidad_tipo: 'validacion',
      entidad_id: validacionId,
      canal: urgencia === 'critica' ? 'email' : 'inapp',
      metadata: {
        categoria: 'urgente',
        prioridad: urgencia,
        requiere_accion: true
      }
    });
  }

  /**
   * Crear notificación de plazo
   */
  static async createPlazoNotification(usuarioId, titulo, mensaje, validacionId, horasRestantes) {
    const canal = horasRestantes <= 24 ? 'email' : 'inapp';
    const prioridad = horasRestantes <= 24 ? 'alta' : 'normal';
    
    return this.create({
      usuario_id: usuarioId,
      titulo,
      mensaje,
      tipo: 'plazo',
      entidad_tipo: 'validacion',
      entidad_id: validacionId,
      canal,
      metadata: {
        categoria: 'plazo',
        prioridad,
        horas_restantes: horasRestantes,
        requiere_accion: horasRestantes <= 24
      }
    });
  }

  // =============================================
  // MÉTODOS DE UTILIDAD
  // =============================================

  /**
   * Verificar si el usuario puede ver esta notificación
   */
  canUserView(usuarioId) {
    return this.usuario_id === usuarioId;
  }

  /**
   * Obtener información completa para API
   */
  toJSON() {
    return {
      id: this.id,
      usuario_id: this.usuario_id,
      
      // Contenido
      titulo: this.titulo,
      mensaje: this.mensaje,
      tipo: this.tipo,
      
      // Contexto
      entidad_tipo: this.entidad_tipo,
      entidad_id: this.entidad_id,
      
      // Estado
      leida: this.leida,
      fecha_lectura: this.fecha_lectura,
      
      // Configuración
      canal: this.canal,
      enviada: this.enviada,
      fecha_envio: this.fecha_envio,
      
      // Metadata
      metadata: this.metadata,
      
      // Auditoría
      creado_en: this.creado_en,
      
      // Información relacionada
      usuario_nombre: this.usuario_nombre,
      usuario_email: this.usuario_email,
      
      // Estados calculados
      es_reciente: this.isRecent(),
      requiere_accion: this.metadata.requiere_accion || false,
      prioridad: this.metadata.prioridad || 'normal'
    };
  }

  /**
   * Verificar si es una notificación reciente (menos de 1 hora)
   */
  isRecent() {
    if (!this.creado_en) return false;
    
    const ahora = new Date();
    const creacion = new Date(this.creado_en);
    const diferencia = ahora.getTime() - creacion.getTime();
    const horasTranscurridas = diferencia / (1000 * 60 * 60);
    
    return horasTranscurridas < 1;
  }
}

module.exports = Notificacion;
