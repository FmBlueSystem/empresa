const database = require('../config/database');
const mysql = require('mysql2/promise');

class Actividad {
  constructor(data) {
    this.id = data.id;
    this.asignacion_id = data.asignacion_id;
    this.tecnico_id = data.tecnico_id;
    this.titulo = data.titulo;
    this.descripcion = data.descripcion;
    this.tipo_actividad = data.tipo_actividad || 'desarrollo';
    this.estado = data.estado || 'pendiente';
    this.prioridad = data.prioridad || 'media';
    
    // Tracking de tiempo
    this.fecha_inicio = data.fecha_inicio;
    this.fecha_fin = data.fecha_fin;
    this.tiempo_estimado_horas = data.tiempo_estimado_horas;
    this.tiempo_trabajado_horas = data.tiempo_trabajado_horas || 0;
    this.cronometro_activo = data.cronometro_activo || false;
    this.ultima_pausa = data.ultima_pausa;
    
    // Progreso
    this.porcentaje_completado = data.porcentaje_completado || 0;
    this.hitos_completados = data.hitos_completados ? JSON.parse(data.hitos_completados) : [];
    
    // Evidencias
    this.archivos_adjuntos = data.archivos_adjuntos ? JSON.parse(data.archivos_adjuntos) : [];
    this.capturas_pantalla = data.capturas_pantalla ? JSON.parse(data.capturas_pantalla) : [];
    this.enlaces_externos = data.enlaces_externos ? JSON.parse(data.enlaces_externos) : [];
    
    // Validación
    this.validado_por = data.validado_por;
    this.fecha_validacion = data.fecha_validacion;
    this.observaciones_validacion = data.observaciones_validacion;
    this.puntuacion_calidad = data.puntuacion_calidad;
    
    // Metadatos
    this.competencias_utilizadas = data.competencias_utilizadas ? JSON.parse(data.competencias_utilizadas) : [];
    this.herramientas_utilizadas = data.herramientas_utilizadas ? JSON.parse(data.herramientas_utilizadas) : [];
    this.dificultad_percibida = data.dificultad_percibida;
    this.satisfaccion_tecnico = data.satisfaccion_tecnico;
    
    // Auditoría
    this.creado_en = data.creado_en;
    this.actualizado_en = data.actualizado_en;
    this.creado_por = data.creado_por;
  }

  // =============================================
  // MÉTODOS CRUD BÁSICOS
  // =============================================

  /**
   * Crear nueva actividad con validaciones completas
   */
  static async create(actividadData) {
    const connection = await database.getConnection();
    
    try {
      await connection.beginTransaction();

      // Validar que la asignación existe y está activa
      await this.validateAsignacion(actividadData.asignacion_id, connection);
      
      // Validar que el técnico pertenece a la asignación
      await this.validateTecnicoEnAsignacion(actividadData.asignacion_id, actividadData.tecnico_id, connection);
      
      // Validar que no hay cronómetro activo para el técnico
      if (actividadData.cronometro_activo) {
        await this.validateCronometroUnico(actividadData.tecnico_id, connection);
      }

      const query = `
        INSERT INTO vf_actividades (
          asignacion_id, tecnico_id, titulo, descripcion, tipo_actividad, estado, prioridad,
          fecha_inicio, fecha_fin, tiempo_estimado_horas, tiempo_trabajado_horas,
          cronometro_activo, porcentaje_completado, hitos_completados,
          archivos_adjuntos, capturas_pantalla, enlaces_externos,
          competencias_utilizadas, herramientas_utilizadas, dificultad_percibida,
          satisfaccion_tecnico, creado_por
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        actividadData.asignacion_id,
        actividadData.tecnico_id,
        actividadData.titulo,
        actividadData.descripcion || null,
        actividadData.tipo_actividad || 'desarrollo',
        actividadData.estado || 'pendiente',
        actividadData.prioridad || 'media',
        actividadData.fecha_inicio || null,
        actividadData.fecha_fin || null,
        actividadData.tiempo_estimado_horas || null,
        actividadData.tiempo_trabajado_horas || 0,
        actividadData.cronometro_activo ? 1 : 0,
        actividadData.porcentaje_completado || 0,
        JSON.stringify(actividadData.hitos_completados || []),
        JSON.stringify(actividadData.archivos_adjuntos || []),
        JSON.stringify(actividadData.capturas_pantalla || []),
        JSON.stringify(actividadData.enlaces_externos || []),
        JSON.stringify(actividadData.competencias_utilizadas || []),
        JSON.stringify(actividadData.herramientas_utilizadas || []),
        actividadData.dificultad_percibida || null,
        actividadData.satisfaccion_tecnico || null,
        actividadData.creado_por || null
      ];

      const [result] = await connection.query(query, values);
      
      await connection.commit();

      // Obtener la actividad creada
      const nuevaActividad = await this.findById(result.insertId);
      
      // Auto-actualizar progreso de asignación si es necesario
      if (actividadData.estado === 'completada') {
        await this.updateAsignacionProgress(actividadData.asignacion_id);
      }

      return nuevaActividad;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Buscar actividad por ID con información relacionada
   */
  static async findById(id) {
    const query = `
      SELECT 
        a.*,
        t.nombre as tecnico_nombre,
        t.apellidos as tecnico_apellidos,
        asig.proyecto_nombre,
        asig.cliente_id,
        c.nombre as cliente_nombre,
        val.nombre as validador_nombre
      FROM vf_actividades a
      LEFT JOIN vf_tecnicos t ON a.tecnico_id = t.id
      LEFT JOIN vf_asignaciones asig ON a.asignacion_id = asig.id
      LEFT JOIN vf_clientes c ON asig.cliente_id = c.id
      LEFT JOIN vf_usuarios val ON a.validado_por = val.id
      WHERE a.id = ?
    `;

    const rows = await database.query(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }

    return new Actividad(rows[0]);
  }

  /**
   * Buscar todas las actividades con filtros avanzados
   */
  static async findAll(filtros = {}, paginacion = {}) {
    let query = `
      SELECT 
        a.*,
        t.nombre as tecnico_nombre,
        t.apellidos as tecnico_apellidos,
        asig.proyecto_nombre,
        asig.cliente_id,
        c.nombre as cliente_nombre,
        val.nombre as validador_nombre
      FROM vf_actividades a
      LEFT JOIN vf_tecnicos t ON a.tecnico_id = t.id
      LEFT JOIN vf_asignaciones asig ON a.asignacion_id = asig.id
      LEFT JOIN vf_clientes c ON asig.cliente_id = c.id
      LEFT JOIN vf_usuarios val ON a.validado_por = val.id
      WHERE 1=1
    `;

    const valores = [];

    // Aplicar filtros
    if (filtros.asignacion_id) {
      query += ` AND a.asignacion_id = ?`;
      valores.push(filtros.asignacion_id);
    }

    if (filtros.tecnico_id) {
      query += ` AND a.tecnico_id = ?`;
      valores.push(filtros.tecnico_id);
    }

    if (filtros.cliente_id) {
      query += ` AND asig.cliente_id = ?`;
      valores.push(filtros.cliente_id);
    }

    if (filtros.estado) {
      if (Array.isArray(filtros.estado)) {
        query += ` AND a.estado IN (${filtros.estado.map(() => '?').join(',')})`;
        valores.push(...filtros.estado);
      } else {
        query += ` AND a.estado = ?`;
        valores.push(filtros.estado);
      }
    }

    if (filtros.tipo_actividad) {
      query += ` AND a.tipo_actividad = ?`;
      valores.push(filtros.tipo_actividad);
    }

    if (filtros.prioridad) {
      query += ` AND a.prioridad = ?`;
      valores.push(filtros.prioridad);
    }

    if (filtros.fecha_desde) {
      query += ` AND a.fecha_inicio >= ?`;
      valores.push(filtros.fecha_desde);
    }

    if (filtros.fecha_hasta) {
      query += ` AND a.fecha_inicio <= ?`;
      valores.push(filtros.fecha_hasta);
    }

    if (filtros.tiempo_min) {
      query += ` AND a.tiempo_trabajado_horas >= ?`;
      valores.push(filtros.tiempo_min);
    }

    if (filtros.tiempo_max) {
      query += ` AND a.tiempo_trabajado_horas <= ?`;
      valores.push(filtros.tiempo_max);
    }

    if (filtros.search) {
      query += ` AND (a.titulo LIKE ? OR a.descripcion LIKE ? OR asig.proyecto_nombre LIKE ?)`;
      const searchTerm = `%${filtros.search}%`;
      valores.push(searchTerm, searchTerm, searchTerm);
    }

    if (filtros.con_evidencias) {
      query += ` AND (JSON_LENGTH(a.archivos_adjuntos) > 0 OR JSON_LENGTH(a.capturas_pantalla) > 0)`;
    }

    if (filtros.validado_por) {
      query += ` AND a.validado_por = ?`;
      valores.push(filtros.validado_por);
    }

    if (filtros.cronometro_activo !== undefined) {
      query += ` AND a.cronometro_activo = ?`;
      valores.push(filtros.cronometro_activo ? 1 : 0);
    }

    // Ordenamiento
    const ordenValido = ['fecha_inicio', 'tiempo_trabajado_horas', 'prioridad', 'estado', 'puntuacion_calidad', 'creado_en'];
    const direccionValida = ['ASC', 'DESC'];
    
    if (filtros.orden && ordenValido.includes(filtros.orden)) {
      const direccion = direccionValida.includes(filtros.direccion?.toUpperCase()) ? filtros.direccion.toUpperCase() : 'DESC';
      query += ` ORDER BY a.${filtros.orden} ${direccion}`;
    } else {
      query += ` ORDER BY a.creado_en DESC`;
    }

    // Paginación
    if (paginacion.limit) {
      const limit = parseInt(paginacion.limit);
      const offset = parseInt(paginacion.offset) || 0;
      const limitClause = `LIMIT ${limit} OFFSET ${offset}`;
      query += ` ${limitClause}`;
    }

    const rows = await database.query(query, valores);
    return rows.map(row => new Actividad(row));
  }

  /**
   * Actualizar actividad
   */
  async update(datosActualizacion) {
    const connection = await database.getConnection();
    
    try {
      await connection.beginTransaction();

      // Construir query de actualización dinámico
      const camposActualizables = [
        'titulo', 'descripcion', 'tipo_actividad', 'prioridad',
        'fecha_inicio', 'fecha_fin', 'tiempo_estimado_horas', 'tiempo_trabajado_horas',
        'porcentaje_completado', 'hitos_completados', 'archivos_adjuntos',
        'capturas_pantalla', 'enlaces_externos', 'competencias_utilizadas',
        'herramientas_utilizadas', 'dificultad_percibida', 'satisfaccion_tecnico'
      ];

      const updates = [];
      const valores = [];

      for (const campo of camposActualizables) {
        if (Object.prototype.hasOwnProperty.call(datosActualizacion, campo)) {
          updates.push(`${campo} = ?`);
          
          // Serializar JSON si es necesario
          if (['hitos_completados', 'archivos_adjuntos', 'capturas_pantalla', 'enlaces_externos', 'competencias_utilizadas', 'herramientas_utilizadas'].includes(campo)) {
            valores.push(JSON.stringify(datosActualizacion[campo]));
          } else if (campo === 'cronometro_activo') {
            valores.push(datosActualizacion[campo] ? 1 : 0);
          } else {
            valores.push(datosActualizacion[campo]);
          }
        }
      }

      if (updates.length === 0) {
        throw new Error('No hay campos para actualizar');
      }

      updates.push('actualizado_en = CURRENT_TIMESTAMP');
      valores.push(this.id);

      const query = `UPDATE vf_actividades SET ${updates.join(', ')} WHERE id = ?`;
      await connection.query(query, valores);

      await connection.commit();

      // Actualizar el objeto actual
      Object.assign(this, datosActualizacion);

      // Auto-actualizar progreso de asignación si cambió el estado o porcentaje
      if (datosActualizacion.estado === 'completada' || datosActualizacion.porcentaje_completado !== undefined) {
        await this.updateAsignacionProgress(this.asignacion_id);
      }

      return this;

    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  /**
   * Eliminar actividad (soft delete - cambiar estado)
   */
  async delete() {
    const query = `DELETE FROM vf_actividades WHERE id = ?`;
    await database.query(query, [this.id]);
    
    // Auto-actualizar progreso de asignación
    await this.updateAsignacionProgress(this.asignacion_id);
    
    return true;
  }

  // =============================================
  // MÉTODOS ESPECIALIZADOS
  // =============================================

  /**
   * Buscar actividades por asignación
   */
  static async findByAsignacion(asignacionId, filtros = {}) {
    return this.findAll({ ...filtros, asignacion_id: asignacionId });
  }

  /**
   * Buscar actividades por técnico
   */
  static async findByTecnico(tecnicoId, filtros = {}) {
    return this.findAll({ ...filtros, tecnico_id: tecnicoId });
  }

  /**
   * Buscar actividades por cliente
   */
  static async findByCliente(clienteId, filtros = {}) {
    return this.findAll({ ...filtros, cliente_id: clienteId });
  }

  /**
   * Buscar actividades por rango de fechas
   */
  static async findByFecha(fechaInicio, fechaFin, filtros = {}) {
    return this.findAll({ 
      ...filtros, 
      fecha_desde: fechaInicio, 
      fecha_hasta: fechaFin 
    });
  }

  /**
   * Buscar actividades pendientes de validación
   */
  static async findPendientesValidacion(clienteId = null) {
    const filtros = { estado: 'completada' };
    if (clienteId) {
      filtros.cliente_id = clienteId;
    }
    return this.findAll(filtros);
  }

  /**
   * Buscar actividades con cronómetro activo
   */
  static async findActivasConCronometro(tecnicoId = null) {
    const filtros = { cronometro_activo: true };
    if (tecnicoId) {
      filtros.tecnico_id = tecnicoId;
    }
    return this.findAll(filtros);
  }

  // =============================================
  // SISTEMA DE ESTADOS
  // =============================================

  /**
   * Cambiar estado de la actividad con validaciones
   */
  async changeStatus(nuevoEstado, observaciones = null, usuarioId = null) {
    const estadosValidos = ['pendiente', 'progreso', 'completada', 'validada', 'rechazada'];
    
    if (!estadosValidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}`);
    }

    // Validar transiciones de estado
    const transicionesValidas = {
      'pendiente': ['progreso', 'completada'],
      'progreso': ['pausada', 'completada', 'pendiente'],
      'completada': ['validada', 'rechazada'],
      'validada': [], // Estado final
      'rechazada': ['pendiente']
    };

    if (!transicionesValidas[this.estado].includes(nuevoEstado)) {
      throw new Error(`Transición inválida de ${this.estado} a ${nuevoEstado}`);
    }

    const updates = { estado: nuevoEstado };

    // Lógica específica por estado
    switch (nuevoEstado) {
      case 'progreso':
        updates.fecha_inicio = updates.fecha_inicio || new Date();
        break;
        
      case 'completada':
        updates.fecha_fin = new Date();
        updates.porcentaje_completado = 100;
        updates.cronometro_activo = false;
        break;
        
      case 'validada':
        updates.validado_por = usuarioId;
        updates.fecha_validacion = new Date();
        if (observaciones) {
          updates.observaciones_validacion = observaciones;
        }
        break;
        
      case 'rechazada':
        updates.validado_por = usuarioId;
        updates.fecha_validacion = new Date();
        updates.observaciones_validacion = observaciones || 'Actividad rechazada';
        break;
    }

    await this.update(updates);
    return this;
  }

  // =============================================
  // SISTEMA DE CRONÓMETRO
  // =============================================

  /**
   * Iniciar cronómetro de la actividad
   */
  async iniciarCronometro(descripcionActual = null) {
    // Validar que no hay otro cronómetro activo para el técnico
    await Actividad.validateCronometroUnico(this.tecnico_id);

    const updates = {
      cronometro_activo: true,
      estado: 'progreso',
      fecha_inicio: this.fecha_inicio || new Date()
    };

    if (descripcionActual) {
      updates.descripcion = descripcionActual;
    }

    await this.update(updates);
    return this;
  }

  /**
   * Pausar cronómetro
   */
  async pausarCronometro(razonPausa = null) {
    if (!this.cronometro_activo) {
      throw new Error('El cronómetro no está activo');
    }

    const updates = {
      cronometro_activo: false,
      ultima_pausa: new Date()
    };

    await this.update(updates);
    return this;
  }

  /**
   * Reanudar cronómetro
   */
  async reanudarCronometro() {
    // Validar que no hay otro cronómetro activo para el técnico
    await Actividad.validateCronometroUnico(this.tecnico_id);

    const updates = {
      cronometro_activo: true,
      estado: 'progreso'
    };

    await this.update(updates);
    return this;
  }

  /**
   * Finalizar cronómetro y registrar tiempo
   */
  async finalizarCronometro(resumenTrabajo = null, tiempoEfectivo = null, porcentajeCompletado = null) {
    if (!this.cronometro_activo) {
      throw new Error('El cronómetro no está activo');
    }

    const updates = {
      cronometro_activo: false,
      fecha_fin: new Date()
    };

    if (resumenTrabajo) {
      updates.descripcion = (this.descripcion || '') + '\n\n' + resumenTrabajo;
    }

    if (tiempoEfectivo !== null) {
      updates.tiempo_trabajado_horas = tiempoEfectivo;
    }

    if (porcentajeCompletado !== null) {
      updates.porcentaje_completado = Math.min(100, Math.max(0, porcentajeCompletado));
      
      // Auto-completar si llega al 100%
      if (porcentajeCompletado >= 100) {
        updates.estado = 'completada';
      }
    }

    await this.update(updates);
    return this;
  }

  /**
   * Calcular tiempo trabajado automáticamente
   */
  calcularTiempoTrabajado() {
    if (!this.fecha_inicio) return 0;

    const fin = this.fecha_fin || new Date();
    const diferencia = fin.getTime() - new Date(this.fecha_inicio).getTime();
    return Math.round((diferencia / (1000 * 60 * 60)) * 100) / 100; // Horas con 2 decimales
  }

  // =============================================
  // GESTIÓN DE EVIDENCIAS
  // =============================================

  /**
   * Agregar archivo adjunto
   */
  async agregarArchivo(archivoInfo) {
    const archivosActuales = [...this.archivos_adjuntos];
    archivosActuales.push({
      id: Date.now(),
      nombre: archivoInfo.nombre,
      ruta: archivoInfo.ruta,
      tipo: archivoInfo.tipo,
      tamaño: archivoInfo.tamaño,
      descripcion: archivoInfo.descripcion,
      fecha_upload: new Date()
    });

    await this.update({ archivos_adjuntos: archivosActuales });
    return this;
  }

  /**
   * Eliminar archivo adjunto
   */
  async eliminarArchivo(archivoId) {
    const archivosActuales = this.archivos_adjuntos.filter(archivo => archivo.id !== archivoId);
    await this.update({ archivos_adjuntos: archivosActuales });
    return this;
  }

  /**
   * Agregar captura de pantalla
   */
  async agregarCaptura(capturaInfo) {
    const capturasActuales = [...this.capturas_pantalla];
    capturasActuales.push({
      id: Date.now(),
      nombre: capturaInfo.nombre,
      ruta: capturaInfo.ruta,
      descripcion: capturaInfo.descripcion,
      fecha_upload: new Date()
    });

    await this.update({ capturas_pantalla: capturasActuales });
    return this;
  }

  /**
   * Agregar enlace externo
   */
  async agregarEnlace(enlaceInfo) {
    const enlacesActuales = [...this.enlaces_externos];
    enlacesActuales.push({
      id: Date.now(),
      url: enlaceInfo.url,
      titulo: enlaceInfo.titulo,
      descripcion: enlaceInfo.descripcion,
      fecha_agregado: new Date()
    });

    await this.update({ enlaces_externos: enlacesActuales });
    return this;
  }

  // =============================================
  // VALIDACIONES Y APROBACIONES
  // =============================================

  /**
   * Validar (aprobar) actividad
   */
  async validar(validadorId, puntuacionCalidad = null, observaciones = null, satisfaccionCliente = null) {
    const updates = {
      estado: 'validada',
      validado_por: validadorId,
      fecha_validacion: new Date()
    };

    if (puntuacionCalidad !== null) {
      updates.puntuacion_calidad = Math.min(5, Math.max(1, puntuacionCalidad));
    }

    if (observaciones) {
      updates.observaciones_validacion = observaciones;
    }

    await this.update(updates);
    
    // Auto-actualizar progreso de asignación
    await this.updateAsignacionProgress(this.asignacion_id);
    
    return this;
  }

  /**
   * Rechazar actividad
   */
  async rechazar(validadorId, observaciones, puntosMejora = []) {
    let observacionesCompletas = observaciones;
    
    if (puntosMejora.length > 0) {
      observacionesCompletas += '\n\nPuntos de mejora:\n';
      observacionesCompletas += puntosMejora.map(punto => `- ${punto}`).join('\n');
    }

    await this.changeStatus('rechazada', observacionesCompletas, validadorId);
    return this;
  }

  // =============================================
  // REPORTES Y ESTADÍSTICAS
  // =============================================

  /**
   * Obtener estadísticas generales de actividades
   */
  static async getEstadisticas(filtros = {}) {
    let whereClause = 'WHERE 1=1';
    const valores = [];

    if (filtros.tecnico_id) {
      whereClause += ' AND tecnico_id = ?';
      valores.push(filtros.tecnico_id);
    }

    if (filtros.cliente_id) {
      whereClause += ' AND asignacion_id IN (SELECT id FROM vf_asignaciones WHERE cliente_id = ?)';
      valores.push(filtros.cliente_id);
    }

    if (filtros.fecha_desde) {
      whereClause += ' AND fecha_inicio >= ?';
      valores.push(filtros.fecha_desde);
    }

    if (filtros.fecha_hasta) {
      whereClause += ' AND fecha_inicio <= ?';
      valores.push(filtros.fecha_hasta);
    }

    const query = `
      SELECT 
        COUNT(*) as total_actividades,
        COUNT(CASE WHEN estado = 'completada' THEN 1 END) as actividades_completadas,
        COUNT(CASE WHEN estado = 'validada' THEN 1 END) as actividades_validadas,
        COUNT(CASE WHEN estado = 'pendiente' THEN 1 END) as actividades_pendientes,
        COUNT(CASE WHEN estado = 'progreso' THEN 1 END) as actividades_progreso,
        COUNT(CASE WHEN estado = 'rechazada' THEN 1 END) as actividades_rechazadas,
        AVG(tiempo_trabajado_horas) as promedio_tiempo_por_actividad,
        SUM(tiempo_trabajado_horas) as total_horas_trabajadas,
        AVG(puntuacion_calidad) as promedio_calidad,
        AVG(porcentaje_completado) as promedio_avance,
        COUNT(CASE WHEN estado = 'validada' THEN 1 END) / COUNT(CASE WHEN estado IN ('completada', 'validada') THEN 1 END) * 100 as tasa_aprobacion
      FROM vf_actividades 
      ${whereClause}
    `;

    const rows = await database.query(query, valores);
    return rows[0];
  }

  /**
   * Reporte de productividad por técnico
   */
  static async getReporteProductividad(tecnicoId, fechaInicio, fechaFin) {
    const query = `
      SELECT 
        t.nombre,
        t.apellidos,
        COUNT(*) as total_actividades,
        COUNT(CASE WHEN a.estado = 'completada' THEN 1 END) as completadas,
        COUNT(CASE WHEN a.estado = 'validada' THEN 1 END) as validadas,
        SUM(a.tiempo_trabajado_horas) as horas_trabajadas,
        AVG(a.puntuacion_calidad) as calidad_promedio,
        AVG(a.porcentaje_completado) as avance_promedio,
        COUNT(CASE WHEN a.fecha_fin <= a.fecha_inicio + INTERVAL a.tiempo_estimado_horas HOUR THEN 1 END) / COUNT(*) * 100 as puntualidad
      FROM vf_actividades a
      JOIN vf_tecnicos t ON a.tecnico_id = t.id
      WHERE a.tecnico_id = ?
        AND a.fecha_inicio BETWEEN ? AND ?
      GROUP BY a.tecnico_id, t.nombre, t.apellidos
    `;

    const rows = await database.query(query, [tecnicoId, fechaInicio, fechaFin]);
    return rows[0] || null;
  }

  // =============================================
  // VALIDACIONES INTERNAS
  // =============================================

  /**
   * Validar que la asignación existe y está activa
   */
  static async validateAsignacion(asignacionId, connection = null) {
    const conn = connection || db;
    
    const query = `
      SELECT id, estado, tecnico_id, cliente_id 
      FROM vf_asignaciones 
      WHERE id = ? AND estado IN ('activa', 'pausada')
    `;

    const rows = await conn.query(query, [asignacionId]);
    
    if (rows.length === 0) {
      throw new Error('La asignación no existe o no está activa');
    }

    return rows[0];
  }

  /**
   * Validar que el técnico pertenece a la asignación
   */
  static async validateTecnicoEnAsignacion(asignacionId, tecnicoId, connection = null) {
    const conn = connection || db;
    
    const query = `
      SELECT id FROM vf_asignaciones 
      WHERE id = ? AND tecnico_id = ?
    `;

    const rows = await conn.query(query, [asignacionId, tecnicoId]);
    
    if (rows.length === 0) {
      throw new Error('El técnico no está asignado a este proyecto');
    }

    return true;
  }

  /**
   * Validar que no hay otro cronómetro activo para el técnico
   */
  static async validateCronometroUnico(tecnicoId, excluirActividadId = null, connection = null) {
    const conn = connection || db;
    
    let query = `
      SELECT id FROM vf_actividades 
      WHERE tecnico_id = ? AND cronometro_activo = 1
    `;
    
    const valores = [tecnicoId];

    if (excluirActividadId) {
      query += ` AND id != ?`;
      valores.push(excluirActividadId);
    }

    const rows = await conn.query(query, valores);
    
    if (rows.length > 0) {
      throw new Error('El técnico ya tiene un cronómetro activo en otra actividad');
    }

    return true;
  }

  /**
   * Auto-actualizar progreso de asignación basado en actividades
   */
  static async updateAsignacionProgress(asignacionId) {
    const query = `
      SELECT 
        COUNT(*) as total_actividades,
        COUNT(CASE WHEN estado IN ('completada', 'validada') THEN 1 END) as actividades_completadas,
        AVG(porcentaje_completado) as promedio_avance,
        SUM(tiempo_trabajado_horas) as total_horas_trabajadas
      FROM vf_actividades 
      WHERE asignacion_id = ?
    `;

    const rows = await database.query(query, [asignacionId]);
    const stats = rows[0];

    if (stats.total_actividades > 0) {
      const porcentajeCalculado = Math.round(
        (stats.actividades_completadas / stats.total_actividades) * 100
      );

      const updateQuery = `
        UPDATE vf_asignaciones 
        SET 
          porcentaje_avance = ?,
          actividades_completadas = ?,
          total_actividades = ?,
          horas_trabajadas = ?
        WHERE id = ?
      `;

      await database.query(updateQuery, [
        porcentajeCalculado,
        stats.actividades_completadas,
        stats.total_actividades,
        stats.total_horas_trabajadas || 0,
        asignacionId
      ]);
    }
  }

  // =============================================
  // MÉTODOS DE UTILIDAD
  // =============================================

  /**
   * Obtener duración formateada
   */
  getDuracionFormateada() {
    if (!this.fecha_inicio) return 'No iniciada';
    
    const inicio = new Date(this.fecha_inicio);
    const fin = this.fecha_fin ? new Date(this.fecha_fin) : new Date();
    
    const diferencia = fin.getTime() - inicio.getTime();
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${horas}h ${minutos}m`;
  }

  /**
   * Verificar si está atrasada
   */
  isAtrasada() {
    if (!this.fecha_fin_estimada || this.estado === 'completada' || this.estado === 'validada') {
      return false;
    }
    
    return new Date() > new Date(this.fecha_fin_estimada);
  }

  /**
   * Obtener información completa para API
   */
  toJSON() {
    return {
      id: this.id,
      asignacion_id: this.asignacion_id,
      tecnico_id: this.tecnico_id,
      titulo: this.titulo,
      descripcion: this.descripcion,
      tipo_actividad: this.tipo_actividad,
      estado: this.estado,
      prioridad: this.prioridad,
      
      // Tiempo
      fecha_inicio: this.fecha_inicio,
      fecha_fin: this.fecha_fin,
      tiempo_estimado_horas: this.tiempo_estimado_horas,
      tiempo_trabajado_horas: this.tiempo_trabajado_horas,
      cronometro_activo: this.cronometro_activo,
      duracion_formateada: this.getDuracionFormateada(),
      
      // Progreso
      porcentaje_completado: this.porcentaje_completado,
      hitos_completados: this.hitos_completados,
      
      // Evidencias
      archivos_adjuntos: this.archivos_adjuntos,
      capturas_pantalla: this.capturas_pantalla,
      enlaces_externos: this.enlaces_externos,
      total_evidencias: this.archivos_adjuntos.length + this.capturas_pantalla.length,
      
      // Validación
      validado_por: this.validado_por,
      fecha_validacion: this.fecha_validacion,
      observaciones_validacion: this.observaciones_validacion,
      puntuacion_calidad: this.puntuacion_calidad,
      
      // Metadatos
      competencias_utilizadas: this.competencias_utilizadas,
      herramientas_utilizadas: this.herramientas_utilizadas,
      dificultad_percibida: this.dificultad_percibida,
      satisfaccion_tecnico: this.satisfaccion_tecnico,
      
      // Estado
      atrasada: this.isAtrasada(),
      
      // Auditoría
      creado_en: this.creado_en,
      actualizado_en: this.actualizado_en,
      
      // Información relacionada (si está disponible)
      tecnico_nombre: this.tecnico_nombre,
      proyecto_nombre: this.proyecto_nombre,
      cliente_nombre: this.cliente_nombre,
      validador_nombre: this.validador_nombre
    };
  }
}

module.exports = Actividad;
