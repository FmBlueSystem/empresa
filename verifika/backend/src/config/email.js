// email.js - Configuración de email para Verifika
const nodemailer = require('nodemailer');
const logger = require('./logger');

class EmailService {
  constructor() {
    this.transporter = null;
    this.isConfigured = false;
    this.initialize();
  }

  initialize() {
    try {
      // Configuración del transporter
      this.transporter = nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: false, // true para puerto 465, false para otros puertos
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      this.isConfigured = !!(process.env.SMTP_USER && process.env.SMTP_PASS);
      
      if (this.isConfigured) {
        logger.info('📧 Servicio de email configurado');
      } else {
        logger.warn('⚠️ Servicio de email no configurado - emails se simularán');
      }

    } catch (error) {
      logger.error('❌ Error al inicializar servicio de email:', error);
      this.isConfigured = false;
    }
  }

  async sendEmail(to, subject, htmlContent, textContent = null) {
    try {
      if (!this.isConfigured) {
        // Simular envío en desarrollo
        logger.info('📧 [SIMULADO] Email enviado:', {
          to,
          subject,
          html: htmlContent.substring(0, 100) + '...'
        });
        return { success: true, messageId: 'simulated_' + Date.now() };
      }

      const mailOptions = {
        from: process.env.EMAIL_FROM || 'Verifika <noreply@bluesystem.io>',
        to,
        subject,
        html: htmlContent,
        text: textContent || this.htmlToText(htmlContent)
      };

      const result = await this.transporter.sendMail(mailOptions);
      
      logger.info('📧 Email enviado exitosamente:', {
        to,
        subject,
        messageId: result.messageId
      });

      return { success: true, messageId: result.messageId };
    } catch (error) {
      logger.error('❌ Error al enviar email:', error);
      throw error;
    }
  }

  async sendInvitationEmail(user, invitationToken) {
    const activationUrl = `${process.env.FRONTEND_URL}/activate?token=${invitationToken}`;
    
    const subject = 'Invitación a Verifika - BlueSystem';
    const htmlContent = this.getInvitationTemplate(user, activationUrl);
    
    return await this.sendEmail(user.email, subject, htmlContent);
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    
    const subject = 'Restablecer contraseña - Verifika';
    const htmlContent = this.getPasswordResetTemplate(user, resetUrl);
    
    return await this.sendEmail(user.email, subject, htmlContent);
  }

  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
    
    const subject = 'Verificar email - Verifika';
    const htmlContent = this.getEmailVerificationTemplate(user, verificationUrl);
    
    return await this.sendEmail(user.email, subject, htmlContent);
  }

  async sendWelcomeEmail(user) {
    const subject = 'Bienvenido a Verifika - BlueSystem';
    const htmlContent = this.getWelcomeTemplate(user);
    
    return await this.sendEmail(user.email, subject, htmlContent);
  }

  async sendNotificationEmail(user, notification) {
    const subject = `Verifika - ${notification.titulo}`;
    const htmlContent = this.getNotificationTemplate(user, notification);
    
    return await this.sendEmail(user.email, subject, htmlContent);
  }

  // Templates de email
  getInvitationTemplate(user, activationUrl) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Invitación a Verifika</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1C5DC4; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; background: #1C5DC4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invitación a Verifika</h1>
              <p>Sistema de Validación de Actividades Técnicas</p>
            </div>
            <div class="content">
              <h2>Hola ${user.nombre},</h2>
              <p>Has sido invitado a unirte a <strong>Verifika</strong>, nuestro sistema de validación de actividades técnicas.</p>
              <p>Tu rol asignado es: <strong>${user.rol}</strong></p>
              <p>Para activar tu cuenta y establecer tu contraseña, haz clic en el siguiente enlace:</p>
              <a href="${activationUrl}" class="button">Activar Cuenta</a>
              <p><strong>Importante:</strong> Este enlace expirará en 24 horas.</p>
              <p>Si no solicitaste esta invitación, puedes ignorar este email.</p>
            </div>
            <div class="footer">
              <p>© 2024 BlueSystem.io - Verifika</p>
              <p>Este email fue enviado automáticamente, por favor no respondas.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getPasswordResetTemplate(user, resetUrl) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Restablecer Contraseña</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1C5DC4; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; background: #1C5DC4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
            .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Restablecer Contraseña</h1>
              <p>Verifika - BlueSystem</p>
            </div>
            <div class="content">
              <h2>Hola ${user.nombre},</h2>
              <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Verifika.</p>
              <p>Para crear una nueva contraseña, haz clic en el siguiente enlace:</p>
              <a href="${resetUrl}" class="button">Restablecer Contraseña</a>
              <div class="warning">
                <strong>⚠️ Importante:</strong>
                <ul>
                  <li>Este enlace expirará en 1 hora</li>
                  <li>Solo puedes usar este enlace una vez</li>
                  <li>Si no solicitaste este reset, ignora este email</li>
                </ul>
              </div>
            </div>
            <div class="footer">
              <p>© 2024 BlueSystem.io - Verifika</p>
              <p>Si tienes problemas, contacta al administrador del sistema.</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getEmailVerificationTemplate(user, verificationUrl) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Verificar Email</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1C5DC4; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; background: #1C5DC4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verificar Email</h1>
              <p>Verifika - BlueSystem</p>
            </div>
            <div class="content">
              <h2>Hola ${user.nombre},</h2>
              <p>Para completar tu registro en Verifika, necesitas verificar tu dirección de email.</p>
              <a href="${verificationUrl}" class="button">Verificar Email</a>
              <p>Este enlace expirará en 24 horas.</p>
            </div>
            <div class="footer">
              <p>© 2024 BlueSystem.io - Verifika</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getWelcomeTemplate(user) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Bienvenido a Verifika</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1C5DC4; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .button { display: inline-block; background: #1C5DC4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Bienvenido a Verifika!</h1>
              <p>Sistema de Validación de Actividades Técnicas</p>
            </div>
            <div class="content">
              <h2>Hola ${user.nombre},</h2>
              <p>¡Tu cuenta en Verifika ha sido activada exitosamente!</p>
              <p>Ya puedes comenzar a usar el sistema con tu rol de <strong>${user.rol}</strong>.</p>
              <a href="${process.env.FRONTEND_URL}/login" class="button">Iniciar Sesión</a>
              <p>Si tienes preguntas, no dudes en contactar al administrador del sistema.</p>
            </div>
            <div class="footer">
              <p>© 2024 BlueSystem.io - Verifika</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  getNotificationTemplate(user, notification) {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${notification.titulo}</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1C5DC4; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9f9f9; }
            .footer { padding: 20px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verifika</h1>
              <p>Notificación del Sistema</p>
            </div>
            <div class="content">
              <h2>${notification.titulo}</h2>
              <p>${notification.mensaje}</p>
              ${notification.enlace ? `<a href="${notification.enlace}" style="display: inline-block; background: #1C5DC4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">Ver Detalles</a>` : ''}
            </div>
            <div class="footer">
              <p>© 2024 BlueSystem.io - Verifika</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  htmlToText(html) {
    // Convertir HTML básico a texto plano
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  }

  async testConnection() {
    try {
      if (!this.isConfigured) {
        return { success: false, message: 'Email no configurado' };
      }

      await this.transporter.verify();
      return { success: true, message: 'Conexión SMTP exitosa' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
}

// Instancia singleton
const emailService = new EmailService();

module.exports = emailService;