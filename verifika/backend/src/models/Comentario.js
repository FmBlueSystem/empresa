const db = require('../config/database');
const mysql = require('mysql2/promise');

class Comentario {
  constructor(data) {
    this.id = data.id;
    this.validacion_id = data.validacion_id;
    this.parent_id = data.parent_id;
    this.usuario_id = data.usuario_id;
    
    // Contenido
    this.comentario = data.comentario;
    this.tipo_comentario = data.tipo_comentario || 'general';
    
    // Adjuntos
    this.adjuntos = data.adjuntos ? JSON.parse(data.adjuntos) : [];
    
    // Threading
    this.nivel_anidacion = data.nivel_anidacion || 0;
    this.hilo_raiz_id = data.hilo_raiz_id;
    
    // Estado
    this.editado = data.editado || false;
    this.fecha_edicion = data.fecha_edicion;
    
    // Auditoría
    this.creado_en = data.creado_en;
    this.actualizado_en = data.actualizado_en;
    
    // Información relacionada (joins)
    this.usuario_nombre = data.usuario_nombre;
    this.usuario_rol = data.usuario_rol;
    this.parent_comentario = data.parent_comentario;
    this.total_respuestas = data.total_respuestas || 0;
  }

  // =============================================
  // MÉTODOS CRUD BÁSICOS
  // =============================================

  /**
   * Crear nuevo comentario con threading automático
   */
  static async create(comentarioData) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Validar que la validación existe
      await this.validateValidacion(comentarioData.validacion_id, connection);
      
      // Calcular nivel de anidación y hilo raíz
      let nivelAnidacion = 0;
      let hiloRaizId = null;
      
      if (comentarioData.parent_id) {
        const parentInfo = await this.getParentInfo(comentarioData.parent_id, connection);
        nivelAnidacion = parentInfo.nivel_anidacion + 1;
        hiloRaizId = parentInfo.hilo_raiz_id || comentarioData.parent_id;
        
        // Limitar nivel de anidación (máximo 5 niveles)
        if (nivelAnidacion > 5) {
          throw new Error('Máximo nivel de anidación alcanzado');
        }
      }

      const query = `
        INSERT INTO vf_comentarios_validacion (
          validacion_id, parent_id, usuario_id, comentario, tipo_comentario,
          adjuntos, nivel_anidacion, hilo_raiz_id
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        comentarioData.validacion_id,
        comentarioData.parent_id || null,
        comentarioData.usuario_id,
        comentarioData.comentario,
        comentarioData.tipo_comentario || 'general',
        JSON.stringify(comentarioData.adjuntos || []),
        nivelAnidacion,
        hiloRaizId
      ];

      const [result] = await connection.execute(query, values);
      
      await connection.commit();

      // Obtener el comentario creado
      const nuevoComentario = await this.findById(result.insertId);
      
      // Crear notificaciones para participantes del hilo
      await this.notificarParticipantes(nuevoComentario);

      return nuevoComentario;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Buscar comentario por ID con información relacionada
   */
  static async findById(id) {
    const query = `
      SELECT 
        c.*,
        u.nombre as usuario_nombre,
        u.rol as usuario_rol,
        parent.comentario as parent_comentario,
        (SELECT COUNT(*) FROM vf_comentarios_validacion WHERE parent_id = c.id) as total_respuestas
      FROM vf_comentarios_validacion c
      LEFT JOIN vf_usuarios u ON c.usuario_id = u.id
      LEFT JOIN vf_comentarios_validacion parent ON c.parent_id = parent.id
      WHERE c.id = ?
    `;

    const [rows] = await db.execute(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }

    return new Comentario(rows[0]);
  }

  /**
   * Buscar comentarios por validación con estructura jerárquica
   */
  static async findByValidacion(validacionId, ordenamiento = 'ASC') {
    // Primero obtener comentarios raíz (sin parent)
    const comentariosRaiz = await this.findComentariosRaiz(validacionId, ordenamiento);
    
    // Luego obtener todas las respuestas de forma jerárquica
    for (const comentario of comentariosRaiz) {
      comentario.respuestas = await this.findRespuestasJerarquicas(comentario.id, ordenamiento);
    }

    return comentariosRaiz;
  }

  /**
   * Buscar comentarios raíz (nivel 0)
   */
  static async findComentariosRaiz(validacionId, ordenamiento = 'ASC') {
    const query = `
      SELECT 
        c.*,
        u.nombre as usuario_nombre,
        u.rol as usuario_rol,
        (SELECT COUNT(*) FROM vf_comentarios_validacion WHERE parent_id = c.id) as total_respuestas
      FROM vf_comentarios_validacion c
      LEFT JOIN vf_usuarios u ON c.usuario_id = u.id
      WHERE c.validacion_id = ? AND c.parent_id IS NULL
      ORDER BY c.creado_en ${ordenamiento}
    `;

    const [rows] = await db.execute(query, [validacionId]);
    return rows.map(row => new Comentario(row));
  }

  /**
   * Buscar respuestas jerárquicas de un comentario
   */
  static async findRespuestasJerarquicas(parentId, ordenamiento = 'ASC') {
    const query = `
      SELECT 
        c.*,
        u.nombre as usuario_nombre,
        u.rol as usuario_rol,
        (SELECT COUNT(*) FROM vf_comentarios_validacion WHERE parent_id = c.id) as total_respuestas
      FROM vf_comentarios_validacion c
      LEFT JOIN vf_usuarios u ON c.usuario_id = u.id
      WHERE c.parent_id = ?
      ORDER BY c.creado_en ${ordenamiento}
    `;

    const [rows] = await db.execute(query, [parentId]);
    const respuestas = rows.map(row => new Comentario(row));

    // Recursivamente obtener respuestas de las respuestas
    for (const respuesta of respuestas) {
      respuesta.respuestas = await this.findRespuestasJerarquicas(respuesta.id, ordenamiento);
    }

    return respuestas;
  }

  /**
   * Actualizar comentario
   */
  async update(datosActualizacion) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Solo permitir actualizar contenido y adjuntos
      const camposActualizables = ['comentario', 'tipo_comentario', 'adjuntos'];
      const updates = [];
      const valores = [];

      for (const campo of camposActualizables) {
        if (datosActualizacion.hasOwnProperty(campo)) {
          updates.push(`${campo} = ?`);
          
          if (campo === 'adjuntos') {
            valores.push(JSON.stringify(datosActualizacion[campo]));
          } else {
            valores.push(datosActualizacion[campo]);
          }
        }
      }

      if (updates.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      // Marcar como editado
      updates.push('editado = 1', 'fecha_edicion = CURRENT_TIMESTAMP', 'actualizado_en = CURRENT_TIMESTAMP');
      valores.push(this.id);

      const query = `UPDATE vf_comentarios_validacion SET ${updates.join(', ')} WHERE id = ?`;
      await connection.execute(query, valores);

      await connection.commit();

      // Actualizar el objeto actual
      Object.assign(this, datosActualizacion, { editado: true, fecha_edicion: new Date() });

      return this;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Eliminar comentario (soft delete)
   */
  async delete() {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();

      // Verificar si tiene respuestas
      const tieneRespuestas = await this.tieneRespuestas();
      
      if (tieneRespuestas) {
        // Si tiene respuestas, marcar como eliminado pero mantener estructura
        await connection.execute(
          'UPDATE vf_comentarios_validacion SET comentario = ?, tipo_comentario = ?, editado = 1 WHERE id = ?',
          ['[Comentario eliminado]', 'general', this.id]
        );
      } else {
        // Si no tiene respuestas, eliminar completamente
        await connection.execute('DELETE FROM vf_comentarios_validacion WHERE id = ?', [this.id]);
      }

      await connection.commit();
      return true;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // =============================================
  // MÉTODOS ESPECIALIZADOS
  // =============================================

  /**
   * Agregar adjunto a comentario
   */
  async agregarAdjunto(adjuntoInfo) {
    const adjuntosActuales = [...this.adjuntos];
    adjuntosActuales.push({
      id: Date.now(),
      nombre: adjuntoInfo.nombre,
      ruta: adjuntoInfo.ruta,
      tipo: adjuntoInfo.tipo,
      tamaño: adjuntoInfo.tamaño,
      fecha_upload: new Date()
    });

    await this.update({ adjuntos: adjuntosActuales });
    return this;
  }

  /**
   * Eliminar adjunto
   */
  async eliminarAdjunto(adjuntoId) {
    const adjuntosActuales = this.adjuntos.filter(adjunto => adjunto.id !== adjuntoId);
    await this.update({ adjuntos: adjuntosActuales });
    return this;
  }

  /**
   * Obtener hilo completo del comentario
   */
  async getHiloCompleto() {
    let hiloRaizId = this.hilo_raiz_id || this.id;
    
    const query = `
      SELECT 
        c.*,
        u.nombre as usuario_nombre,
        u.rol as usuario_rol
      FROM vf_comentarios_validacion c
      LEFT JOIN vf_usuarios u ON c.usuario_id = u.id
      WHERE c.id = ? OR c.hilo_raiz_id = ?
      ORDER BY c.nivel_anidacion ASC, c.creado_en ASC
    `;

    const [rows] = await db.execute(query, [hiloRaizId, hiloRaizId]);
    return rows.map(row => new Comentario(row));
  }

  /**
   * Obtener estadísticas del comentario
   */
  async getEstadisticas() {
    const query = `
      SELECT 
        COUNT(*) as total_respuestas,
        COUNT(CASE WHEN tipo_comentario = 'pregunta' THEN 1 END) as preguntas,
        COUNT(CASE WHEN tipo_comentario = 'sugerencia' THEN 1 END) as sugerencias,
        COUNT(CASE WHEN tipo_comentario = 'correccion' THEN 1 END) as correcciones,
        MAX(nivel_anidacion) as max_nivel_anidacion
      FROM vf_comentarios_validacion 
      WHERE hilo_raiz_id = ? OR id = ?
    `;

    const hiloRaizId = this.hilo_raiz_id || this.id;
    const [rows] = await db.execute(query, [hiloRaizId, hiloRaizId]);
    return rows[0];
  }

  // =============================================
  // NOTIFICACIONES
  // =============================================

  /**
   * Notificar a participantes del hilo
   */
  static async notificarParticipantes(comentario) {
    // Obtener usuarios únicos que han participado en el hilo
    const participantes = await this.getParticipantesHilo(comentario.validacion_id, comentario.id);
    
    for (const participante of participantes) {
      if (participante.usuario_id !== comentario.usuario_id) {
        await this.createNotificacion(
          participante.usuario_id,
          'comentario',
          'Nuevo comentario en validación',
          `${comentario.usuario_nombre} ha respondido en una validación donde participas`,
          'comentario',
          comentario.id
        );
      }
    }

    // Notificar también al validador original si no está en los participantes
    const validacion = await this.getValidacionInfo(comentario.validacion_id);
    const participantesIds = participantes.map(p => p.usuario_id);
    
    if (!participantesIds.includes(validacion.validador_id) && validacion.validador_id !== comentario.usuario_id) {
      await this.createNotificacion(
        validacion.validador_id,
        'comentario',
        'Nuevo comentario en tu validación',
        `${comentario.usuario_nombre} ha comentado en tu validación "${validacion.actividad_titulo}"`,
        'comentario',
        comentario.id
      );
    }
  }

  /**
   * Obtener participantes únicos del hilo
   */
  static async getParticipantesHilo(validacionId, excluirComentarioId = null) {
    let whereClause = 'WHERE validacion_id = ?';
    const valores = [validacionId];

    if (excluirComentarioId) {
      whereClause += ' AND id != ?';
      valores.push(excluirComentarioId);
    }

    const query = `
      SELECT DISTINCT usuario_id, u.nombre as usuario_nombre
      FROM vf_comentarios_validacion c
      LEFT JOIN vf_usuarios u ON c.usuario_id = u.id
      ${whereClause}
    `;

    const [rows] = await db.execute(query, valores);
    return rows;
  }

  // =============================================
  // BÚSQUEDAS Y FILTROS
  // =============================================

  /**
   * Buscar comentarios con filtros avanzados
   */
  static async findAll(filtros = {}, paginacion = {}) {
    let query = `
      SELECT 
        c.*,
        u.nombre as usuario_nombre,
        u.rol as usuario_rol,
        v.actividad_id,
        a.titulo as actividad_titulo
      FROM vf_comentarios_validacion c
      LEFT JOIN vf_usuarios u ON c.usuario_id = u.id
      LEFT JOIN vf_validaciones v ON c.validacion_id = v.id
      LEFT JOIN vf_actividades a ON v.actividad_id = a.id
      WHERE 1=1
    `;

    const valores = [];

    // Aplicar filtros
    if (filtros.validacion_id) {
      query += ` AND c.validacion_id = ?`;
      valores.push(filtros.validacion_id);
    }

    if (filtros.usuario_id) {
      query += ` AND c.usuario_id = ?`;
      valores.push(filtros.usuario_id);
    }

    if (filtros.tipo_comentario) {
      query += ` AND c.tipo_comentario = ?`;
      valores.push(filtros.tipo_comentario);
    }

    if (filtros.nivel_anidacion !== undefined) {
      query += ` AND c.nivel_anidacion = ?`;
      valores.push(filtros.nivel_anidacion);
    }

    if (filtros.search) {
      query += ` AND c.comentario LIKE ?`;
      valores.push(`%${filtros.search}%`);
    }

    if (filtros.fecha_desde) {
      query += ` AND c.creado_en >= ?`;
      valores.push(filtros.fecha_desde);
    }

    if (filtros.fecha_hasta) {
      query += ` AND c.creado_en <= ?`;
      valores.push(filtros.fecha_hasta);
    }

    // Ordenamiento
    const ordenValido = ['creado_en', 'actualizado_en', 'nivel_anidacion'];
    const direccionValida = ['ASC', 'DESC'];
    
    if (filtros.orden && ordenValido.includes(filtros.orden)) {
      const direccion = direccionValida.includes(filtros.direccion?.toUpperCase()) ? filtros.direccion.toUpperCase() : 'ASC';
      query += ` ORDER BY c.${filtros.orden} ${direccion}`;
    } else {
      query += ` ORDER BY c.creado_en ASC`;
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
    return rows.map(row => new Comentario(row));
  }

  /**
   * Buscar comentarios por tipo
   */
  static async findByTipo(tipo, validacionId = null) {
    const filtros = { tipo_comentario: tipo };
    if (validacionId) {
      filtros.validacion_id = validacionId;
    }
    return this.findAll(filtros);
  }

  /**
   * Buscar comentarios recientes
   */
  static async findRecientes(limit = 10) {
    return this.findAll({}, { limit, offset: 0 });
  }

  // =============================================
  // REPORTES Y ESTADÍSTICAS
  // =============================================

  /**
   * Obtener estadísticas de comentarios por validación
   */
  static async getEstadisticasValidacion(validacionId) {
    const query = `
      SELECT 
        COUNT(*) as total_comentarios,
        COUNT(CASE WHEN tipo_comentario = 'pregunta' THEN 1 END) as preguntas,
        COUNT(CASE WHEN tipo_comentario = 'sugerencia' THEN 1 END) as sugerencias,
        COUNT(CASE WHEN tipo_comentario = 'correccion' THEN 1 END) as correcciones,
        COUNT(CASE WHEN tipo_comentario = 'aprobacion' THEN 1 END) as aprobaciones,
        COUNT(DISTINCT usuario_id) as participantes_unicos,
        MAX(nivel_anidacion) as max_nivel_anidacion,
        COUNT(CASE WHEN adjuntos != '[]' THEN 1 END) as comentarios_con_adjuntos
      FROM vf_comentarios_validacion 
      WHERE validacion_id = ?
    `;

    const [rows] = await db.execute(query, [validacionId]);
    return rows[0];
  }

  /**
   * Obtener ranking de usuarios más activos en comentarios
   */
  static async getRankingUsuarios(periodo = 30) {
    const query = `
      SELECT 
        u.nombre,
        u.rol,
        COUNT(*) as total_comentarios,
        COUNT(CASE WHEN c.tipo_comentario = 'pregunta' THEN 1 END) as preguntas,
        COUNT(CASE WHEN c.tipo_comentario = 'sugerencia' THEN 1 END) as sugerencias,
        AVG(LENGTH(c.comentario)) as promedio_longitud
      FROM vf_comentarios_validacion c
      LEFT JOIN vf_usuarios u ON c.usuario_id = u.id
      WHERE c.creado_en >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY c.usuario_id, u.nombre, u.rol
      ORDER BY total_comentarios DESC
      LIMIT 10
    `;

    const [rows] = await db.execute(query, [periodo]);
    return rows;
  }

  // =============================================
  // VALIDACIONES INTERNAS
  // =============================================

  /**
   * Validar que la validación existe
   */
  static async validateValidacion(validacionId, connection = null) {
    const conn = connection || db;
    
    const query = `SELECT id FROM vf_validaciones WHERE id = ?`;
    const [rows] = await conn.execute(query, [validacionId]);
    
    if (rows.length === 0) {
      throw new Error('La validación no existe');
    }

    return true;
  }

  /**
   * Obtener información del comentario padre
   */
  static async getParentInfo(parentId, connection = null) {
    const conn = connection || db;
    
    const query = `
      SELECT nivel_anidacion, hilo_raiz_id 
      FROM vf_comentarios_validacion 
      WHERE id = ?
    `;

    const [rows] = await conn.execute(query, [parentId]);
    
    if (rows.length === 0) {
      throw new Error('El comentario padre no existe');
    }

    return rows[0];
  }

  /**
   * Verificar si tiene respuestas
   */
  async tieneRespuestas() {
    const query = `SELECT COUNT(*) as count FROM vf_comentarios_validacion WHERE parent_id = ?`;
    const [rows] = await db.execute(query, [this.id]);
    return rows[0].count > 0;
  }

  /**
   * Obtener información de la validación
   */
  static async getValidacionInfo(validacionId) {
    const query = `
      SELECT v.validador_id, a.titulo as actividad_titulo
      FROM vf_validaciones v
      LEFT JOIN vf_actividades a ON v.actividad_id = a.id
      WHERE v.id = ?
    `;

    const [rows] = await db.execute(query, [validacionId]);
    return rows[0];
  }

  /**
   * Crear notificación
   */
  static async createNotificacion(usuarioId, tipo, titulo, mensaje, entidadTipo, entidadId) {
    const query = `
      INSERT INTO vf_notificaciones (usuario_id, tipo, titulo, mensaje, entidad_tipo, entidad_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    await db.execute(query, [usuarioId, tipo, titulo, mensaje, entidadTipo, entidadId]);
  }

  // =============================================
  // MÉTODOS DE UTILIDAD
  // =============================================

  /**
   * Obtener información completa para API
   */
  toJSON(incluirRespuestas = false) {
    const data = {
      id: this.id,
      validacion_id: this.validacion_id,
      parent_id: this.parent_id,
      usuario_id: this.usuario_id,
      
      // Contenido
      comentario: this.comentario,
      tipo_comentario: this.tipo_comentario,
      
      // Adjuntos
      adjuntos: this.adjuntos,
      total_adjuntos: this.adjuntos.length,
      
      // Threading
      nivel_anidacion: this.nivel_anidacion,
      hilo_raiz_id: this.hilo_raiz_id,
      total_respuestas: this.total_respuestas,
      
      // Estado
      editado: this.editado,
      fecha_edicion: this.fecha_edicion,
      
      // Auditoría
      creado_en: this.creado_en,
      actualizado_en: this.actualizado_en,
      
      // Información relacionada
      usuario_nombre: this.usuario_nombre,
      usuario_rol: this.usuario_rol,
      parent_comentario: this.parent_comentario
    };

    // Incluir respuestas si se solicita
    if (incluirRespuestas && this.respuestas) {
      data.respuestas = this.respuestas.map(respuesta => respuesta.toJSON(true));
    }

    return data;
  }

  /**
   * Formatear para vista jerárquica
   */
  toHierarchicalView() {
    return {
      ...this.toJSON(),
      indentacion: '  '.repeat(this.nivel_anidacion),
      es_respuesta: this.nivel_anidacion > 0,
      puede_responder: this.nivel_anidacion < 5
    };
  }
}

module.exports = Comentario;
