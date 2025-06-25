const express = require('express');
const Joi = require('joi');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const logger = require('../config/logger');

const router = express.Router();

// Rate limiting específico para formulario de contacto
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 3, // máximo 3 envíos por IP cada 15 minutos
  message: {
    error: 'Demasiados envíos de formulario. Intenta nuevamente en 15 minutos.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Configuración de Nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

// Schema de validación con Joi
const contactSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'El nombre debe tener al menos 2 caracteres',
      'string.max': 'El nombre no puede exceder 50 caracteres',
      'any.required': 'El nombre es obligatorio'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'El email debe tener un formato válido',
      'any.required': 'El email es obligatorio'
    }),

  phone: Joi.string()
    .pattern(/^[+]?[\d\s\-()]{10,20}$/)
    .optional()
    .messages({
      'string.pattern.base': 'El teléfono debe tener un formato válido'
    }),

  company: Joi.string()
    .max(100)
    .optional()
    .messages({
      'string.max': 'El nombre de la empresa no puede exceder 100 caracteres'
    }),

  employees: Joi.string()
    .valid('1-10', '11-50', '51-200', '201-1000', '1000+')
    .optional(),

  country: Joi.string()
    .valid('costa-rica', 'guatemala', 'el-salvador', 'honduras', 'nicaragua', 'panama', 'mexico', 'otros')
    .optional(),

  service: Joi.string()
    .valid('sap', 'ia', 'office365', 'desarrollo-web', 'consultoria', 'otro')
    .optional(),

  message: Joi.string()
    .min(10)
    .max(1000)
    .required()
    .messages({
      'string.min': 'El mensaje debe tener al menos 10 caracteres',
      'string.max': 'El mensaje no puede exceder 1000 caracteres',
      'any.required': 'El mensaje es obligatorio'
    }),


  timeline: Joi.string()
    .valid('inmediato', '1-3-meses', '3-6-meses', '6-12-meses', 'no-definido')
    .optional(),

  newsletter: Joi.boolean().optional(),

  // Honeypot field para prevenir spam
  website: Joi.string().max(0).optional()
});

/**
 * POST /api/contact
 * Envío de formulario de contacto
 */
router.post('/', contactLimiter, async (req, res) => {
  try {
    // Validar datos de entrada
    const { error, value } = contactSchema.validate(req.body);

    if (error) {
      logger.warn('Validación de formulario fallida:', error.details);
      return res.status(400).json({
        error: 'Datos inválidos',
        details: error.details.map(detail => ({
          field: detail.path[0],
          message: detail.message
        }))
      });
    }

    // Verificar honeypot (campo website debe estar vacío)
    if (value.website && value.website.length > 0) {
      logger.warn('Intento de spam detectado:', { ip: req.ip, data: value });
      return res.status(400).json({
        error: 'Solicitud inválida'
      });
    }

    // Preparar datos limpios
    const contactData = {
      name: value.name.trim(),
      email: value.email.toLowerCase().trim(),
      phone: value.phone?.trim() || '',
      company: value.company?.trim() || '',
      employees: value.employees || 'no-especificado',
      country: value.country || 'no-especificado',
      service: value.service || 'no-especificado',
      message: value.message.trim(),
      timeline: value.timeline || 'no-definido',
      newsletter: value.newsletter || false,
      submittedAt: new Date().toISOString(),
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    // Configurar emails
    const transporter = createTransporter();

    // Email de notificación interna
    const adminEmailOptions = {
      from: `"BlueSystem.io Contact Form" <${process.env.FROM_EMAIL}>`,
      to: process.env.ADMIN_EMAIL || 'contacto@bluesystem.io',
      subject: `🚀 Nueva consulta de ${contactData.name} - ${contactData.service}`,
      html: generateAdminEmailTemplate(contactData),
      text: generateAdminEmailText(contactData)
    };

    // Email de confirmación para el usuario
    const userEmailOptions = {
      from: `"BlueSystem.io" <${process.env.FROM_EMAIL}>`,
      to: contactData.email,
      subject: '✅ Recibimos tu consulta - BlueSystem.io',
      html: generateUserEmailTemplate(contactData),
      text: generateUserEmailText(contactData)
    };

    // Enviar emails
    await Promise.all([
      transporter.sendMail(adminEmailOptions),
      transporter.sendMail(userEmailOptions)
    ]);

    logger.info('Formulario de contacto procesado exitosamente:', {
      name: contactData.name,
      email: contactData.email,
      service: contactData.service,
      ip: contactData.ip
    });

    // Respuesta exitosa
    res.status(200).json({
      success: true,
      message: 'Tu consulta ha sido enviada exitosamente. Te contactaremos pronto.',
      timestamp: contactData.submittedAt
    });

  } catch (error) {
    logger.error('Error procesando formulario de contacto:', error);

    res.status(500).json({
      error: 'Error interno del servidor',
      message: 'No pudimos procesar tu consulta. Por favor intenta nuevamente.'
    });
  }
});

/**
 * GET /api/contact/services
 * Obtener lista de servicios disponibles
 */
router.get('/services', (req, res) => {
  const services = [
    {
      value: 'sap',
      label: 'Consultoría SAP',
      description: 'Implementación y optimización SAP S/4HANA'
    },
    {
      value: 'ia',
      label: 'Automatización con IA',
      description: 'Soluciones inteligentes y automatización de procesos'
    },
    {
      value: 'office365',
      label: 'Integraciones Office 365',
      description: 'Conectividad y colaboración en ecosistema Microsoft'
    },
    {
      value: 'desarrollo-web',
      label: 'Desarrollo Web Empresarial',
      description: 'Aplicaciones web modernas y escalables'
    },
    {
      value: 'consultoria',
      label: 'Consultoría Estratégica',
      description: 'Transformación digital integral'
    },
    {
      value: 'otro',
      label: 'Otro',
      description: 'Proyecto específico o necesidad personalizada'
    }
  ];

  res.json({ services });
});

// Templates de email
function generateAdminEmailTemplate(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1C5DC4, #2563EB); color: white; padding: 20px; text-align: center;">
        <h1>🚀 Nueva Consulta BlueSystem.io</h1>
      </div>
      
      <div style="padding: 20px; background: #f8f9fa;">
        <h2 style="color: #1C5DC4;">Información del Cliente</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Nombre:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.name}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.email}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Teléfono:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.phone || 'No proporcionado'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Empresa:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.company || 'No especificada'}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Tamaño:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.employees}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>País:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.country}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Servicio:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.service}</td></tr>
          <tr><td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>Timeline:</strong></td><td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.timeline}</td></tr>
        </table>
        
        <h3 style="color: #1C5DC4; margin-top: 20px;">Mensaje:</h3>
        <div style="background: white; padding: 15px; border-left: 4px solid #1C5DC4; margin: 10px 0;">
          ${data.message.replace(/\n/g, '<br>')}
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: #e3f2fd; border-radius: 5px;">
          <small style="color: #666;">
            <strong>Detalles técnicos:</strong><br>
            IP: ${data.ip}<br>
            Fecha: ${new Date(data.submittedAt).toLocaleString('es-MX')}<br>
            Newsletter: ${data.newsletter ? 'Sí' : 'No'}
          </small>
        </div>
      </div>
    </div>
  `;
}

function generateAdminEmailText(data) {
  return `
NUEVA CONSULTA BLUESYSTEM.IO

Información del Cliente:
- Nombre: ${data.name}
- Email: ${data.email}
- Teléfono: ${data.phone || 'No proporcionado'}
- Empresa: ${data.company || 'No especificada'}
- Tamaño: ${data.employees}
- País: ${data.country}
- Servicio: ${data.service}
- Timeline: ${data.timeline}

Mensaje:
${data.message}

Detalles técnicos:
- IP: ${data.ip}
- Fecha: ${new Date(data.submittedAt).toLocaleString('es-MX')}
- Newsletter: ${data.newsletter ? 'Sí' : 'No'}
  `;
}

function generateUserEmailTemplate(data) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1C5DC4, #2563EB); color: white; padding: 20px; text-align: center;">
        <h1>✅ Consulta Recibida</h1>
        <p>Gracias por contactar BlueSystem.io</p>
      </div>
      
      <div style="padding: 20px;">
        <p>Hola <strong>${data.name}</strong>,</p>
        
        <p>Hemos recibido tu consulta sobre <strong>${data.service}</strong> y nuestro equipo la está revisando.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="color: #1C5DC4; margin-top: 0;">Resumen de tu consulta:</h3>
          <p><strong>Empresa:</strong> ${data.company || 'No especificada'}</p>
          <p><strong>Tamaño:</strong> ${data.employees}</p>
          <p><strong>País:</strong> ${data.country}</p>
          <p><strong>Servicio:</strong> ${data.service}</p>
          <p><strong>Timeline:</strong> ${data.timeline}</p>
        </div>
        
        <p><strong>¿Qué sigue?</strong></p>
        <ul>
          <li>Revisaremos tu consulta en las próximas 24 horas</li>
          <li>Te contactaremos para una reunión inicial</li>
          <li>Prepararemos una propuesta personalizada</li>
        </ul>
        
        <p>Si tienes alguna pregunta urgente, puedes contactarnos directamente:</p>
        <ul>
          <li>📧 Email: contacto@bluesystem.io</li>
          <li>📞 Teléfono: +506 7219-2010</li>
          <li>📍 Ubicación: San José, Costa Rica</li>
        </ul>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="https://bluesystem.io" style="background: #1C5DC4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Visitar BlueSystem.io</a>
        </div>
        
        <p style="color: #666; font-size: 14px;">
          Este email fue enviado automáticamente. Por favor no respondas a este mensaje.
        </p>
      </div>
    </div>
  `;
}

function generateUserEmailText(data) {
  return `
CONSULTA RECIBIDA - BLUESYSTEM.IO

Hola ${data.name},

Hemos recibido tu consulta sobre ${data.service} y nuestro equipo la está revisando.

Resumen de tu consulta:
- Empresa: ${data.company || 'No especificada'}
- Tamaño: ${data.employees}
- País: ${data.country}
- Servicio: ${data.service}
- Timeline: ${data.timeline}

¿Qué sigue?
- Revisaremos tu consulta en las próximas 24 horas
- Te contactaremos para una reunión inicial
- Prepararemos una propuesta personalizada

Contacto directo:
- Email: contacto@bluesystem.io
- Teléfono: +506 7219-2010
- Ubicación: San José, Costa Rica

Visita: https://bluesystem.io

Este email fue enviado automáticamente.
  `;
}

module.exports = router;
