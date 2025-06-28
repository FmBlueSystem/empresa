const Notificacion = require('../models/Notificacion');
const EmailService = require('./EmailService');
const logger = require('../config/logger');
const db = require('../config/database');

class NotificationService {
  constructor() {
    this.emailService = new EmailService();
    this.smsService = null; // Para futuro SMS provider
    this.pushService = null; // Para futuro push notifications
  }

  // =============================================
  // MÉTODOS PRINCIPALES DE ENVÍO
  // =============================================

  /**
   * Crear y enviar notificación automáticamente
   */
  async notify(notificacionData) {
    try {
      // Crear la notificación en base de datos
      const notificacion = await Notificacion.create(notificacionData);
      
      // Enviar según el canal especificado
      await this.sendByChannel(notificacion);
      
      return notificacion;

    } catch (error) {
      logger.error('Error enviando notificación:', error);
      throw error;
    }
  }

  /**
   * Enviar notificación según su canal
   */
  async sendByChannel(notificacion) {
    try {
      switch (notificacion.canal) {
        case 'email':
          await this.sendEmail(notificacion);
          break;
        
        case 'sms':
          await this.sendSMS(notificacion);
          break;
        
        case 'push':
          await this.sendPush(notificacion);
          break;
        
        case 'inapp':
        default:
          // Las notificaciones in-app solo se guardan en DB
          await notificacion.marcarComoEnviada();
          break;
      }

    } catch (error) {
      logger.error(`Error enviando por canal ${notificacion.canal}:`, error);
      throw error;
    }
  }

  /**
   * Enviar notificación por email
   */
  async sendEmail(notificacion) {
    try {
      const templateData = this.prepareEmailTemplate(notificacion);
      
      await this.emailService.sendNotificationEmail(
        notificacion.usuario_email,
        templateData.subject,
        templateData.template,
        templateData.data
      );

      await notificacion.marcarComoEnviada();
      logger.info(`Email enviado a ${notificacion.usuario_email} - ${notificacion.tipo}`);

    } catch (error) {
      logger.error('Error enviando email:', error);
      throw error;
    }
  }

  /**
   * Enviar notificación por SMS (placeholder)
   */
  async sendSMS(notificacion) {
    // Implementar cuando se integre proveedor SMS
    logger.info(`SMS notification queued for user ${notificacion.usuario_id}`);
    await notificacion.marcarComoEnviada();
  }

  /**
   * Enviar notificación push (placeholder)
   */
  async sendPush(notificacion) {
    // Implementar cuando se integre servicio push
    logger.info(`Push notification queued for user ${notificacion.usuario_id}`);
    await notificacion.marcarComoEnviada();
  }

  // =============================================
  // MÉTODOS DE CREACIÓN ESPECÍFICOS
  // =============================================

  /**
   * Notificar nueva validación pendiente
   */
  async notifyNewValidation(validadorId, actividadTitulo, actividadId, urgencia = 'normal') {
    const canal = urgencia === 'alta' ? 'email' : 'inapp';
    
    return this.notify({
      usuario_id: validadorId,
      titulo: 'Nueva actividad para validar',
      mensaje: `Tienes una nueva actividad "${actividadTitulo}" pendiente de validación`,
      tipo: 'validacion',
      entidad_tipo: 'actividad',
      entidad_id: actividadId,
      canal,
      metadata: {
        categoria: 'workflow',
        prioridad: urgencia,
        requiere_accion: true
      }
    });
  }

  /**
   * Notificar comentario en validación
   */
  async notifyNewComment(usuarioId, validacionTitulo, autorNombre, comentarioId) {
    return this.notify({
      usuario_id: usuarioId,
      titulo: 'Nuevo comentario en validación',
      mensaje: `${autorNombre} ha comentado en la validación "${validacionTitulo}"`,
      tipo: 'comentario',
      entidad_tipo: 'comentario',
      entidad_id: comentarioId,
      canal: 'inapp',
      metadata: {
        categoria: 'social',
        prioridad: 'normal',
        autor: autorNombre
      }
    });
  }

  /**
   * Notificar respuesta a comentario
   */
  async notifyCommentReply(usuarioId, validacionTitulo, autorNombre, comentarioId, parentId) {
    return this.notify({
      usuario_id: usuarioId,
      titulo: 'Respuesta a tu comentario',
      mensaje: `${autorNombre} ha respondido a tu comentario en "${validacionTitulo}"`,
      tipo: 'comentario',
      entidad_tipo: 'comentario',
      entidad_id: comentarioId,
      canal: 'inapp',
      metadata: {
        categoria: 'social',
        prioridad: 'normal',
        autor: autorNombre,
        parent_comment_id: parentId,
        es_respuesta: true
      }
    });
  }

  /**
   * Notificar validación aprobada
   */
  async notifyValidationApproved(tecnicoId, actividadTitulo, puntuacion, validacionId) {
    return this.notify({
      usuario_id: tecnicoId,
      titulo: 'Actividad validada',
      mensaje: `Tu actividad "${actividadTitulo}" ha sido aprobada con puntuación ${puntuacion}/10`,
      tipo: 'aprobacion',
      entidad_tipo: 'validacion',
      entidad_id: validacionId,
      canal: 'email',
      metadata: {
        categoria: 'resultado',
        prioridad: 'normal',
        puntuacion,
        positivo: true
      }
    });
  }

  /**
   * Notificar validación rechazada
   */
  async notifyValidationRejected(tecnicoId, actividadTitulo, motivo, validacionId) {
    return this.notify({
      usuario_id: tecnicoId,
      titulo: 'Actividad rechazada',
      mensaje: `Tu actividad "${actividadTitulo}" necesita correcciones: ${motivo}`,
      tipo: 'rechazo',
      entidad_tipo: 'validacion',
      entidad_id: validacionId,
      canal: 'email',
      metadata: {
        categoria: 'resultado',
        prioridad: 'alta',
        motivo,
        requiere_accion: true,
        positivo: false
      }
    });
  }

  /**
   * Notificar escalamiento manual
   */
  async notifyManualEscalation(supervisorId, actividadTitulo, razon, validacionId, urgencia = 'normal') {
    return this.notify({
      usuario_id: supervisorId,
      titulo: 'Validación escalada',
      mensaje: `Se ha escalado la validación de "${actividadTitulo}": ${razon}`,
      tipo: 'escalamiento',
      entidad_tipo: 'validacion',
      entidad_id: validacionId,
      canal: urgencia === 'critica' ? 'email' : 'inapp',
      metadata: {
        categoria: 'escalamiento',
        prioridad: urgencia,
        razon,
        requiere_accion: true,
        escalamiento_manual: true
      }
    });
  }

  /**
   * Notificar escalamiento automático
   */
  async notifyAutoEscalation(supervisorId, actividadTitulo, validacionId) {
    return this.notify({
      usuario_id: supervisorId,
      titulo: 'Escalamiento automático',
      mensaje: `Validación vencida escalada automáticamente: "${actividadTitulo}"`,
      tipo: 'escalamiento',
      entidad_tipo: 'validacion',
      entidad_id: validacionId,
      canal: 'email',
      metadata: {
        categoria: 'escalamiento',
        prioridad: 'alta',
        requiere_accion: true,
        escalamiento_automatico: true
      }
    });
  }

  /**
   * Notificar plazo próximo a vencer
   */
  async notifyDeadlineWarning(usuarioId, actividadTitulo, horasRestantes, validacionId) {
    const canal = horasRestantes <= 24 ? 'email' : 'inapp';
    const prioridad = horasRestantes <= 6 ? 'critica' : horasRestantes <= 24 ? 'alta' : 'normal';
    
    return this.notify({
      usuario_id: usuarioId,
      titulo: 'Plazo de validación próximo',
      mensaje: `La validación de "${actividadTitulo}" vence en ${Math.round(horasRestantes)} horas`,
      tipo: 'plazo',
      entidad_tipo: 'validacion',
      entidad_id: validacionId,
      canal,
      metadata: {
        categoria: 'plazo',
        prioridad,
        horas_restantes: horasRestantes,
        requiere_accion: true
      }
    });
  }

  /**
   * Notificar plazo vencido
   */
  async notifyDeadlineExpired(usuarioId, actividadTitulo, validacionId) {
    return this.notify({
      usuario_id: usuarioId,
      titulo: 'Plazo de validación vencido',
      mensaje: `El plazo para validar "${actividadTitulo}" ha vencido`,
      tipo: 'plazo',
      entidad_tipo: 'validacion',
      entidad_id: validacionId,
      canal: 'email',
      metadata: {
        categoria: 'plazo',
        prioridad: 'critica',
        vencido: true,
        requiere_accion: true
      }
    });
  }

  /**
   * Notificar validación reabierta
   */
  async notifyValidationReopened(usuarioId, actividadTitulo, motivo, validacionId) {
    return this.notify({
      usuario_id: usuarioId,
      titulo: 'Validación reabierta',
      mensaje: `La validación de "${actividadTitulo}" ha sido reabierta: ${motivo}`,
      tipo: 'validacion',
      entidad_tipo: 'validacion',
      entidad_id: validacionId,
      canal: 'email',
      metadata: {
        categoria: 'workflow',
        prioridad: 'normal',
        motivo,
        reabierta: true,
        requiere_accion: true
      }
    });
  }

  // =============================================
  // NOTIFICACIONES MASIVAS
  // =============================================

  /**
   * Notificar a múltiples usuarios participantes en validación
   */
  async notifyValidationParticipants(validacionId, titulo, mensaje, excluirUsuarioId = null) {
    try {
      // Obtener participantes únicos de la validación y sus comentarios
      const participantes = await this.getValidationParticipants(validacionId);
      
      const notificaciones = [];
      
      for (const participante of participantes) {
        if (participante.usuario_id !== excluirUsuarioId) {
          const notificacion = await this.notify({
            usuario_id: participante.usuario_id,
            titulo,
            mensaje,
            tipo: 'validacion',
            entidad_tipo: 'validacion',
            entidad_id: validacionId,
            canal: 'inapp',
            metadata: {
              categoria: 'grupo',
              prioridad: 'normal',
              notificacion_masiva: true
            }
          });
          
          notificaciones.push(notificacion);
        }
      }
      
      return notificaciones;

    } catch (error) {
      logger.error('Error enviando notificaciones masivas:', error);
      throw error;
    }
  }

  /**
   * Obtener participantes únicos de una validación
   */
  async getValidationParticipants(validacionId) {
    const query = `
      SELECT DISTINCT usuario_id, u.nombre, u.email
      FROM (
        SELECT validador_id as usuario_id FROM vf_validaciones WHERE id = ?
        UNION
        SELECT tecnico_id as usuario_id FROM vf_validaciones WHERE id = ?
        UNION
        SELECT supervisor_escalado_id as usuario_id FROM vf_validaciones WHERE id = ? AND supervisor_escalado_id IS NOT NULL
        UNION
        SELECT usuario_id FROM vf_comentarios_validacion WHERE validacion_id = ?
      ) participantes
      LEFT JOIN vf_usuarios u ON participantes.usuario_id = u.id
      WHERE participantes.usuario_id IS NOT NULL
    `;

    const [rows] = await db.execute(query, [validacionId, validacionId, validacionId, validacionId]);
    return rows;
  }

  // =============================================
  // PROCESAMIENTO AUTOMÁTICO
  // =============================================

  /**
   * Procesar notificaciones de plazos (ejecutar en cron)
   */
  async processDeadlineNotifications() {
    try {
      const validaciones = await this.getValidationsWithUpcomingDeadlines();
      
      let enviadas = 0;
      
      for (const validacion of validaciones) {
        const horasRestantes = this.calculateHoursRemaining(validacion.fecha_limite);
        
        // Notificar a 24h, 6h, 1h antes del vencimiento
        if (this.shouldNotifyDeadline(horasRestantes, validacion.ultima_notificacion_plazo)) {
          await this.notifyDeadlineWarning(
            validacion.validador_id,
            validacion.actividad_titulo,
            horasRestantes,
            validacion.id
          );
          
          // Actualizar última notificación de plazo
          await this.updateLastDeadlineNotification(validacion.id);
          enviadas++;
        }
      }
      
      logger.info(`Procesadas ${enviadas} notificaciones de plazo`);
      return enviadas;

    } catch (error) {
      logger.error('Error procesando notificaciones de plazo:', error);
      throw error;
    }
  }

  /**
   * Procesar escalamientos automáticos (ejecutar en cron)
   */
  async processAutoEscalations() {
    try {
      const validacionesVencidas = await this.getExpiredValidations();
      
      let escaladas = 0;
      
      for (const validacion of validacionesVencidas) {
        if (validacion.supervisor_id) {
          await this.notifyAutoEscalation(
            validacion.supervisor_id,
            validacion.actividad_titulo,
            validacion.id
          );
          
          escaladas++;
        }
      }
      
      logger.info(`Procesados ${escaladas} escalamientos automáticos`);
      return escaladas;

    } catch (error) {
      logger.error('Error procesando escalamientos automáticos:', error);
      throw error;
    }
  }

  /**
   * Procesar envío de notificaciones pendientes
   */
  async processPendingNotifications() {
    try {
      const pendientes = await Notificacion.findPendingToSend();
      
      let enviadas = 0;
      
      for (const notificacion of pendientes) {
        await this.sendByChannel(notificacion);
        enviadas++;
      }
      
      logger.info(`Enviadas ${enviadas} notificaciones pendientes`);
      return enviadas;

    } catch (error) {
      logger.error('Error procesando notificaciones pendientes:', error);
      throw error;
    }
  }

  // =============================================
  // MÉTODOS DE UTILIDAD
  // =============================================

  /**
   * Preparar template de email según tipo de notificación
   */
  prepareEmailTemplate(notificacion) {
    const baseData = {
      titulo: notificacion.titulo,
      mensaje: notificacion.mensaje,
      usuario_nombre: notificacion.usuario_nombre,
      metadata: notificacion.metadata,
      fecha: new Date().toLocaleDateString('es-ES'),
      plataforma: 'Verifika'
    };

    switch (notificacion.tipo) {
      case 'validacion':
        return {
          subject: `[Verifika] ${notificacion.titulo}`,
          template: 'validation_notification',
          data: {
            ...baseData,
            cta_text: 'Revisar Actividad',
            cta_url: `${process.env.FRONTEND_URL}/validaciones/${notificacion.entidad_id}`
          }
        };

      case 'escalamiento':
        return {
          subject: `[URGENTE] ${notificacion.titulo}`,
          template: 'escalation_notification',
          data: {
            ...baseData,
            urgente: true,
            cta_text: 'Revisar Escalamiento',
            cta_url: `${process.env.FRONTEND_URL}/validaciones/${notificacion.entidad_id}`
          }
        };

      case 'plazo':
        return {
          subject: `[PLAZO] ${notificacion.titulo}`,
          template: 'deadline_notification',
          data: {
            ...baseData,
            horas_restantes: notificacion.metadata.horas_restantes,
            cta_text: 'Validar Ahora',
            cta_url: `${process.env.FRONTEND_URL}/validaciones/${notificacion.entidad_id}`
          }
        };

      case 'aprobacion':
        return {
          subject: `[Verifika] Actividad Aprobada`,
          template: 'approval_notification',
          data: {
            ...baseData,
            positivo: true,
            puntuacion: notificacion.metadata.puntuacion,
            cta_text: 'Ver Detalles',
            cta_url: `${process.env.FRONTEND_URL}/actividades`
          }
        };

      case 'rechazo':
        return {
          subject: `[Verifika] Actividad Rechazada`,
          template: 'rejection_notification',
          data: {
            ...baseData,
            negativo: true,
            motivo: notificacion.metadata.motivo,
            cta_text: 'Ver Correcciones',
            cta_url: `${process.env.FRONTEND_URL}/actividades`
          }
        };

      default:
        return {
          subject: `[Verifika] ${notificacion.titulo}`,
          template: 'general_notification',
          data: baseData
        };
    }
  }

  /**
   * Calcular horas restantes hasta fecha límite
   */
  calculateHoursRemaining(fechaLimite) {
    const ahora = new Date();
    const limite = new Date(fechaLimite);
    const diferencia = limite.getTime() - ahora.getTime();
    return Math.max(0, diferencia / (1000 * 60 * 60));
  }

  /**
   * Determinar si debe enviar notificación de plazo
   */
  shouldNotifyDeadline(horasRestantes, ultimaNotificacion) {
    // Enviar a 24h, 6h, 1h antes del vencimiento
    const thresholds = [24, 6, 1];
    
    for (const threshold of thresholds) {
      if (horasRestantes <= threshold && horasRestantes > 0) {
        // Verificar que no se haya enviado notificación reciente para este threshold
        return !this.wasRecentlyNotified(ultimaNotificacion, threshold);
      }
    }
    
    return false;
  }

  /**
   * Verificar si se notificó recientemente
   */
  wasRecentlyNotified(ultimaNotificacion, threshold) {
    if (!ultimaNotificacion) return false;
    
    const ahora = new Date();
    const ultima = new Date(ultimaNotificacion);
    const horasTranscurridas = (ahora.getTime() - ultima.getTime()) / (1000 * 60 * 60);
    
    // No notificar si se envió hace menos de threshold/2 horas
    return horasTranscurridas < (threshold / 2);
  }

  /**
   * Obtener validaciones con plazos próximos
   */
  async getValidationsWithUpcomingDeadlines() {
    const query = `
      SELECT v.*, a.titulo as actividad_titulo
      FROM vf_validaciones v
      LEFT JOIN vf_actividades a ON v.actividad_id = a.id
      WHERE v.fecha_limite <= DATE_ADD(NOW(), INTERVAL 24 HOUR)
        AND v.fecha_limite > NOW()
        AND v.estado IN ('pendiente_revision', 'en_revision')
    `;

    const [rows] = await db.execute(query);
    return rows;
  }

  /**
   * Obtener validaciones vencidas
   */
  async getExpiredValidations() {
    const query = `
      SELECT v.*, a.titulo as actividad_titulo, 
             (SELECT u.id FROM vf_usuarios u WHERE u.cliente_id = v.cliente_id AND u.rol = 'supervisor' LIMIT 1) as supervisor_id
      FROM vf_validaciones v
      LEFT JOIN vf_actividades a ON v.actividad_id = a.id
      WHERE v.fecha_limite < NOW()
        AND v.estado IN ('pendiente_revision', 'en_revision')
        AND v.escalada_automaticamente = 0
    `;

    const [rows] = await db.execute(query);
    return rows;
  }

  /**
   * Actualizar última notificación de plazo
   */
  async updateLastDeadlineNotification(validacionId) {
    const query = `
      UPDATE vf_validaciones 
      SET ultima_notificacion_plazo = NOW() 
      WHERE id = ?
    `;

    await db.execute(query, [validacionId]);
  }

  // =============================================
  // MÉTODOS DE CONFIGURACIÓN
  // =============================================

  /**
   * Configurar preferencias de notificación por usuario
   */
  async setUserNotificationPreferences(usuarioId, preferencias) {
    // Implementar cuando se agregue tabla de preferencias
    logger.info(`Configurando preferencias para usuario ${usuarioId}:`, preferencias);
  }

  /**
   * Obtener estadísticas del servicio
   */
  async getServiceStats() {
    const stats = await Notificacion.getGlobalStats();
    
    return {
      ...stats,
      servicio_activo: true,
      ultima_actualizacion: new Date(),
      canales_habilitados: {
        inapp: true,
        email: this.emailService.isConfigured(),
        sms: !!this.smsService,
        push: !!this.pushService
      }
    };
  }
}

module.exports = NotificationService;
