const nodemailer = require('nodemailer');
const logger = require('../config/logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isInitialized = false;
    this.templates = {};
    this.initialize();
  }

  // =============================================
  // INICIALIZACIÓN Y CONFIGURACIÓN
  // =============================================

  async initialize() {
    try {
      // Configurar transporter según variables de entorno
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD
        },
        tls: {
          rejectUnauthorized: process.env.NODE_ENV === 'production'
        }
      });

      // Verificar configuración
      if (this.isConfigured()) {
        await this.transporter.verify();
        this.isInitialized = true;
        logger.info('📧 EmailService inicializado correctamente');
      } else {
        logger.warn('⚠️ EmailService no configurado - usando modo simulación');
      }

      // Cargar templates
      this.loadTemplates();

    } catch (error) {
      logger.error('❌ Error inicializando EmailService:', error);
      this.isInitialized = false;
    }
  }

  /**
   * Verificar si el servicio está configurado
   */
  isConfigured() {
    return !!(process.env.SMTP_USER && process.env.SMTP_PASSWORD);
  }

  /**
   * Cargar templates de email
   */
  loadTemplates() {
    this.templates = {
      // Template general
      general_notification: this.getGeneralTemplate(),
      
      // Templates específicos de validación
      validation_notification: this.getValidationTemplate(),
      escalation_notification: this.getEscalationTemplate(),
      deadline_notification: this.getDeadlineTemplate(),
      approval_notification: this.getApprovalTemplate(),
      rejection_notification: this.getRejectionTemplate(),
      
      // Templates de comentarios
      comment_notification: this.getCommentTemplate(),
      
      // Templates de sistema
      welcome: this.getWelcomeTemplate(),
      password_reset: this.getPasswordResetTemplate()
    };
  }

  // =============================================
  // MÉTODOS PRINCIPALES DE ENVÍO
  // =============================================

  /**
   * Enviar email de notificación
   */
  async sendNotificationEmail(to, subject, templateName, data) {
    try {
      if (!this.isInitialized || !this.isConfigured()) {
        logger.info(`[SIMULACIÓN] Email a ${to}: ${subject}`);
        return { success: true, simulated: true };
      }

      const template = this.templates[templateName] || this.templates.general_notification;
      const html = this.renderTemplate(template, data);
      const text = this.generateTextVersion(data);

      const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME || 'Verifika'}" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html,
        text,
        headers: {
          'X-Priority': this.getPriority(data.metadata?.prioridad),
          'X-Verifika-Type': data.metadata?.categoria || 'notification'
        }
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      logger.info(`✅ Email enviado: ${to} - ${subject}`);
      return { 
        success: true, 
        messageId: result.messageId,
        simulated: false 
      };

    } catch (error) {
      logger.error('❌ Error enviando email:', error);
      throw error;
    }
  }

  /**
   * Enviar email de bienvenida
   */
  async sendWelcomeEmail(to, userData) {
    const subject = `¡Bienvenido a Verifika, ${userData.nombre}!`;
    
    return this.sendNotificationEmail(to, subject, 'welcome', {
      ...userData,
      login_url: `${process.env.FRONTEND_URL}/login`,
      plataforma: 'Verifika'
    });
  }

  /**
   * Enviar email de recuperación de contraseña
   */
  async sendPasswordResetEmail(to, resetToken, userData) {
    const subject = 'Recuperación de contraseña - Verifika';
    
    return this.sendNotificationEmail(to, subject, 'password_reset', {
      ...userData,
      reset_url: `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`,
      expiry_hours: 24,
      plataforma: 'Verifika'
    });
  }

  /**
   * Enviar múltiples emails en lote
   */
  async sendBatchEmails(emails) {
    const results = [];
    
    for (const email of emails) {
      try {
        const result = await this.sendNotificationEmail(
          email.to,
          email.subject,
          email.template,
          email.data
        );
        
        results.push({
          email: email.to,
          success: true,
          result
        });
        
        // Pequeña pausa entre emails para evitar rate limiting
        await this.delay(100);
        
      } catch (error) {
        results.push({
          email: email.to,
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  }

  // =============================================
  // TEMPLATES DE EMAIL
  // =============================================

  /**
   * Template general para notificaciones
   */
  getGeneralTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{titulo}}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .alert { padding: 15px; margin: 20px 0; border-radius: 5px; }
        .alert-info { background-color: #d1ecf1; border: 1px solid #bee5eb; color: #0c5460; }
        .alert-warning { background-color: #fff3cd; border: 1px solid #ffeaa7; color: #856404; }
        .alert-success { background-color: #d4edda; border: 1px solid #c3e6cb; color: #155724; }
        .alert-danger { background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{plataforma}}</h1>
            <h2>{{titulo}}</h2>
        </div>
        <div class="content">
            <p>Hola {{usuario_nombre}},</p>
            <p>{{mensaje}}</p>
            
            {{#if cta_url}}
            <div style="text-align: center;">
                <a href="{{cta_url}}" class="btn">{{cta_text}}</a>
            </div>
            {{/if}}
            
            <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
            <p>Saludos,<br>El equipo de {{plataforma}}</p>
        </div>
        <div class="footer">
            <p>Este es un mensaje automático, por favor no responder a este email.</p>
            <p>{{fecha}} | {{plataforma}} - Sistema de Gestión de Validaciones</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Template para notificaciones de validación
   */
  getValidationTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{titulo}}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .priority-high { border-left: 4px solid #dc3545; padding-left: 15px; margin: 20px 0; }
        .activity-card { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔍 {{plataforma}}</h1>
            <h2>{{titulo}}</h2>
        </div>
        <div class="content">
            <p>Hola {{usuario_nombre}},</p>
            
            {{#if metadata.requiere_accion}}
            <div class="priority-high">
                <strong>⚡ Acción requerida:</strong> {{mensaje}}
            </div>
            {{else}}
            <p>{{mensaje}}</p>
            {{/if}}
            
            <div class="activity-card">
                <h3>📋 Detalles de la Actividad</h3>
                <p><strong>Prioridad:</strong> {{metadata.prioridad}}</p>
                <p><strong>Categoría:</strong> {{metadata.categoria}}</p>
            </div>
            
            <div style="text-align: center;">
                <a href="{{cta_url}}" class="btn">{{cta_text}}</a>
            </div>
            
            <p><small>💡 <strong>Tip:</strong> Puedes revisar todas tus validaciones pendientes en el dashboard.</small></p>
            
            <p>Saludos,<br>El equipo de {{plataforma}}</p>
        </div>
        <div class="footer">
            <p>Este es un mensaje automático, por favor no responder a este email.</p>
            <p>{{fecha}} | {{plataforma}} - Sistema de Gestión de Validaciones</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Template para escalamientos
   */
  getEscalationTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{titulo}}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .urgent-banner { background-color: #f8d7da; border: 2px solid #dc3545; padding: 15px; border-radius: 5px; margin: 20px 0; text-align: center; }
        .escalation-info { background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 {{plataforma}}</h1>
            <h2>{{titulo}}</h2>
        </div>
        <div class="content">
            {{#if urgente}}
            <div class="urgent-banner">
                <strong>⚠️ ESCALAMIENTO URGENTE</strong>
            </div>
            {{/if}}
            
            <p>Hola {{usuario_nombre}},</p>
            <p>{{mensaje}}</p>
            
            <div class="escalation-info">
                <h3>📊 Información del Escalamiento</h3>
                <p><strong>Prioridad:</strong> {{metadata.prioridad}}</p>
                <p><strong>Categoría:</strong> {{metadata.categoria}}</p>
                {{#if metadata.razon}}
                <p><strong>Razón:</strong> {{metadata.razon}}</p>
                {{/if}}
                {{#if metadata.escalamiento_automatico}}
                <p><strong>Tipo:</strong> Escalamiento Automático por Tiempo Vencido</p>
                {{else}}
                <p><strong>Tipo:</strong> Escalamiento Manual</p>
                {{/if}}
            </div>
            
            <div style="text-align: center;">
                <a href="{{cta_url}}" class="btn">{{cta_text}}</a>
            </div>
            
            <p><strong>Nota:</strong> Como supervisor, es importante revisar este escalamiento lo antes posible.</p>
            
            <p>Saludos,<br>El equipo de {{plataforma}}</p>
        </div>
        <div class="footer">
            <p>Este es un mensaje automático, por favor no responder a este email.</p>
            <p>{{fecha}} | {{plataforma}} - Sistema de Gestión de Validaciones</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Template para notificaciones de plazo
   */
  getDeadlineTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{titulo}}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #ffc107; color: #212529; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
        .countdown { background-color: #fff3cd; border: 2px solid #ffc107; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .progress-bar { background-color: #e9ecef; border-radius: 10px; overflow: hidden; margin: 15px 0; }
        .progress-fill { background-color: #ffc107; height: 8px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>⏰ {{plataforma}}</h1>
            <h2>{{titulo}}</h2>
        </div>
        <div class="content">
            <p>Hola {{usuario_nombre}},</p>
            <p>{{mensaje}}</p>
            
            <div class="countdown">
                <h3>⏳ Tiempo Restante</h3>
                <h2 style="color: #856404; margin: 10px 0;">{{horas_restantes}} horas</h2>
                
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {{progress_percentage}}%;"></div>
                </div>
                
                {{#if metadata.vencido}}
                <p style="color: #dc3545;"><strong>⚠️ PLAZO VENCIDO</strong></p>
                {{else}}
                <p><strong>¡Es importante completar la validación pronto!</strong></p>
                {{/if}}
            </div>
            
            <div style="text-align: center;">
                <a href="{{cta_url}}" class="btn">{{cta_text}}</a>
            </div>
            
            <p>📝 <strong>Recordatorio:</strong> Las validaciones completadas a tiempo ayudan a mantener un flujo de trabajo eficiente.</p>
            
            <p>Saludos,<br>El equipo de {{plataforma}}</p>
        </div>
        <div class="footer">
            <p>Este es un mensaje automático, por favor no responder a este email.</p>
            <p>{{fecha}} | {{plataforma}} - Sistema de Gestión de Validaciones</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Template para aprobaciones
   */
  getApprovalTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{titulo}}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .success-banner { background-color: #d4edda; border: 2px solid #28a745; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
        .score-card { background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .score { font-size: 2em; font-weight: bold; color: #28a745; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✅ {{plataforma}}</h1>
            <h2>{{titulo}}</h2>
        </div>
        <div class="content">
            <div class="success-banner">
                <h2>🎉 ¡Felicitaciones {{usuario_nombre}}!</h2>
                <p>Tu trabajo ha sido aprobado</p>
            </div>
            
            <p>{{mensaje}}</p>
            
            {{#if puntuacion}}
            <div class="score-card">
                <h3>📊 Puntuación Obtenida</h3>
                <div class="score">{{puntuacion}}/10</div>
                <p>¡Excelente trabajo!</p>
            </div>
            {{/if}}
            
            <div style="text-align: center;">
                <a href="{{cta_url}}" class="btn">{{cta_text}}</a>
            </div>
            
            <p>🌟 <strong>¡Sigue así!</strong> Tu dedicación y calidad de trabajo son ejemplares.</p>
            
            <p>Saludos,<br>El equipo de {{plataforma}}</p>
        </div>
        <div class="footer">
            <p>Este es un mensaje automático, por favor no responder a este email.</p>
            <p>{{fecha}} | {{plataforma}} - Sistema de Gestión de Validaciones</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Template para rechazos
   */
  getRejectionTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{titulo}}</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #dc3545; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .feedback-card { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 20px; margin: 20px 0; }
        .action-required { background-color: #f8d7da; border: 2px solid #dc3545; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📝 {{plataforma}}</h1>
            <h2>{{titulo}}</h2>
        </div>
        <div class="content">
            <p>Hola {{usuario_nombre}},</p>
            
            <div class="action-required">
                <strong>🔄 Acción Requerida:</strong> {{mensaje}}
            </div>
            
            {{#if motivo}}
            <div class="feedback-card">
                <h3>💬 Feedback del Cliente</h3>
                <p>{{motivo}}</p>
            </div>
            {{/if}}
            
            <div style="text-align: center;">
                <a href="{{cta_url}}" class="btn">{{cta_text}}</a>
            </div>
            
            <p>💡 <strong>Recuerda:</strong> Este feedback te ayudará a mejorar y entregar un trabajo aún mejor.</p>
            <p>📞 Si tienes dudas sobre las correcciones, no dudes en contactar al equipo.</p>
            
            <p>Saludos,<br>El equipo de {{plataforma}}</p>
        </div>
        <div class="footer">
            <p>Este es un mensaje automático, por favor no responder a este email.</p>
            <p>{{fecha}} | {{plataforma}} - Sistema de Gestión de Validaciones</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Template para comentarios
   */
  getCommentTemplate() {
    return this.getGeneralTemplate(); // Usa el template general por ahora
  }

  /**
   * Template de bienvenida
   */
  getWelcomeTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a Verifika</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .welcome-card { background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .feature-list { list-style: none; padding: 0; }
        .feature-list li { padding: 8px 0; }
        .feature-list li:before { content: "✓"; color: #28a745; font-weight: bold; margin-right: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 ¡Bienvenido a {{plataforma}}!</h1>
        </div>
        <div class="content">
            <div class="welcome-card">
                <h2>Hola {{nombre}},</h2>
                <p>Es un placer tenerte en nuestro equipo. {{plataforma}} es tu plataforma de gestión de validaciones donde podrás:</p>
            </div>
            
            <ul class="feature-list">
                <li>Gestionar actividades y proyectos</li>
                <li>Participar en procesos de validación</li>
                <li>Colaborar con comentarios y feedback</li>
                <li>Recibir notificaciones en tiempo real</li>
                <li>Acceder a reportes y métricas</li>
            </ul>
            
            <div style="text-align: center;">
                <a href="{{login_url}}" class="btn">Acceder a la Plataforma</a>
            </div>
            
            <p><strong>Tu información de acceso:</strong></p>
            <ul>
                <li><strong>Email:</strong> {{email}}</li>
                <li><strong>Rol:</strong> {{rol}}</li>
            </ul>
            
            <p>Si tienes alguna pregunta o necesitas ayuda para comenzar, no dudes en contactarnos.</p>
            
            <p>¡Esperamos verte pronto en la plataforma!</p>
            
            <p>Saludos,<br>El equipo de {{plataforma}}</p>
        </div>
        <div class="footer">
            <p>Este es un mensaje automático, por favor no responder a este email.</p>
            <p>{{plataforma}} - Sistema de Gestión de Validaciones</p>
        </div>
    </div>
</body>
</html>`;
  }

  /**
   * Template de reset de contraseña
   */
  getPasswordResetTemplate() {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Recuperación de Contraseña</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; }
        .header { background: linear-gradient(135deg, #6c757d 0%, #495057 100%); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .footer { background-color: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #6c757d; }
        .btn { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .security-note { background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🔐 {{plataforma}}</h1>
            <h2>Recuperación de Contraseña</h2>
        </div>
        <div class="content">
            <p>Hola {{nombre}},</p>
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en {{plataforma}}.</p>
            
            <div style="text-align: center;">
                <a href="{{reset_url}}" class="btn">Restablecer Contraseña</a>
            </div>
            
            <div class="security-note">
                <h3>🛡️ Información de Seguridad</h3>
                <ul>
                    <li>Este enlace expira en {{expiry_hours}} horas</li>
                    <li>Solo puede ser usado una vez</li>
                    <li>Si no solicitaste este cambio, ignora este email</li>
                </ul>
            </div>
            
            <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #007bff;">{{reset_url}}</p>
            
            <p>Si no solicitaste este restablecimiento, puedes ignorar este email con seguridad.</p>
            
            <p>Saludos,<br>El equipo de {{plataforma}}</p>
        </div>
        <div class="footer">
            <p>Este es un mensaje automático, por favor no responder a este email.</p>
            <p>{{plataforma}} - Sistema de Gestión de Validaciones</p>
        </div>
    </div>
</body>
</html>`;
  }

  // =============================================
  // MÉTODOS DE UTILIDAD
  // =============================================

  /**
   * Renderizar template con datos
   */
  renderTemplate(template, data) {
    let rendered = template;
    
    // Reemplazar variables simples {{variable}}
    rendered = rendered.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return this.getValue(data, key) || '';
    });
    
    // Reemplazar variables anidadas {{object.property}}
    rendered = rendered.replace(/\{\{([\w.]+)\}\}/g, (match, key) => {
      return this.getValue(data, key) || '';
    });
    
    // Procesar condicionales {{#if condition}}...{{/if}}
    rendered = rendered.replace(/\{\{#if\s+(\w+)\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, condition, content) => {
      return this.getValue(data, condition) ? content : '';
    });
    
    // Procesar loops básicos {{#each array}}...{{/each}}
    rendered = rendered.replace(/\{\{#each\s+(\w+)\}\}([\s\S]*?)\{\{\/each\}\}/g, (match, arrayName, template) => {
      const array = this.getValue(data, arrayName);
      if (!Array.isArray(array)) return '';
      
      return array.map(item => {
        return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
          return item[key] || '';
        });
      }).join('');
    });
    
    return rendered;
  }

  /**
   * Obtener valor anidado de objeto
   */
  getValue(obj, path) {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  }

  /**
   * Generar versión de texto del email
   */
  generateTextVersion(data) {
    let text = `${data.plataforma}\n`;
    text += `${data.titulo}\n\n`;
    text += `Hola ${data.usuario_nombre},\n\n`;
    text += `${data.mensaje}\n\n`;
    
    if (data.cta_url) {
      text += `Enlace: ${data.cta_url}\n\n`;
    }
    
    text += `Saludos,\nEl equipo de ${data.plataforma}\n\n`;
    text += `---\n`;
    text += `Este es un mensaje automático.\n`;
    text += `${data.fecha} | ${data.plataforma}`;
    
    return text;
  }

  /**
   * Obtener prioridad del email
   */
  getPriority(prioridad) {
    switch (prioridad) {
      case 'critica': return '1 (Highest)';
      case 'alta': return '2 (High)';
      case 'normal': return '3 (Normal)';
      case 'baja': return '4 (Low)';
      default: return '3 (Normal)';
    }
  }

  /**
   * Delay para rate limiting
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // =============================================
  // ESTADÍSTICAS Y MONITOREO
  // =============================================

  /**
   * Obtener estadísticas del servicio
   */
  getStats() {
    return {
      configured: this.isConfigured(),
      initialized: this.isInitialized,
      templates_loaded: Object.keys(this.templates).length,
      smtp_host: process.env.SMTP_HOST || 'No configurado',
      smtp_port: process.env.SMTP_PORT || 'No configurado',
      from_address: process.env.SMTP_USER || 'No configurado'
    };
  }

  /**
   * Verificar conectividad SMTP
   */
  async testConnection() {
    try {
      if (!this.isConfigured()) {
        return { success: false, error: 'Servicio no configurado' };
      }

      await this.transporter.verify();
      return { success: true, message: 'Conexión SMTP exitosa' };

    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Enviar email de prueba
   */
  async sendTestEmail(to) {
    return this.sendNotificationEmail(to, 'Email de Prueba - Verifika', 'general_notification', {
      titulo: 'Email de Prueba',
      mensaje: 'Este es un email de prueba para verificar la configuración del servicio.',
      usuario_nombre: 'Usuario de Prueba',
      fecha: new Date().toLocaleDateString('es-ES'),
      plataforma: 'Verifika'
    });
  }
}

module.exports = EmailService;
