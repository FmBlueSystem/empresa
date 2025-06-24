// tecnicos.js - Rutas para gestión de técnicos (FASE 2.2)
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;

const { authenticateToken, requireAdmin, requireTecnico, requireRole } = require('../middleware/auth');
const { sendSuccess, sendError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// Modelos
const Tecnico = require('../models/Tecnico');

// Validadores
const {
  createTecnicoSchema,
  updateTecnicoSchema,
  searchTecnicosSchema,
  changeStatusSchema,
  addCompetenciaSchema,
  uploadDocumentoSchema,
  updateDisponibilidadSchema,
  validateRequest,
  validateQuery
} = require('../validators/tecnicoValidators');

const router = express.Router();

// Configuración de multer para upload de archivos
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/tecnicos');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${req.params.id}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);

    if (extName && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen (JPG, PNG, GIF) y documentos (PDF, DOC, DOCX)'));
    }
  }
});

// GET /api/tecnicos - Listar técnicos con filtros y paginación
router.get('/', 
  authenticateToken, 
  requireRole('admin', 'cliente'),
  validateQuery(searchTecnicosSchema),
  async (req, res) => {
    try {
      const options = req.validatedQuery;
      const result = await Tecnico.findAll(options);

      logger.info(`Listado de técnicos solicitado por usuario ${req.user.id}`, {
        filtros: options,
        resultados: result.tecnicos.length
      });

      sendSuccess(res, result, 'Técnicos obtenidos exitosamente');

    } catch (error) {
      logger.error('Error al listar técnicos:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// GET /api/tecnicos/available - Técnicos disponibles para asignación
router.get('/available',
  authenticateToken,
  requireRole('admin', 'cliente'),
  async (req, res) => {
    try {
      const { competencias } = req.query;
      const competencias_requeridas = competencias ? competencias.split(',').map(Number) : [];
      
      const tecnicos = await Tecnico.getAvailable(competencias_requeridas);

      sendSuccess(res, { tecnicos }, 'Técnicos disponibles obtenidos exitosamente');

    } catch (error) {
      logger.error('Error al obtener técnicos disponibles:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// GET /api/tecnicos/stats - Estadísticas de técnicos
router.get('/stats',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const stats = await Tecnico.getStats();
      sendSuccess(res, { stats }, 'Estadísticas obtenidas exitosamente');

    } catch (error) {
      logger.error('Error al obtener estadísticas:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// GET /api/tecnicos/:id - Obtener técnico específico
router.get('/:id',
  authenticateToken,
  requireRole('admin', 'tecnico', 'cliente'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Los técnicos solo pueden ver su propio perfil
      if (req.user.rol === 'tecnico') {
        const tecnicoActual = await Tecnico.findByUserId(req.user.id);
        if (!tecnicoActual || tecnicoActual.id !== parseInt(id)) {
          return sendError(res, 'No tienes permisos para ver este perfil', 403);
        }
      }

      const tecnico = await Tecnico.findById(id);
      if (!tecnico) {
        return sendError(res, 'Técnico no encontrado', 404);
      }

      // Obtener competencias y documentos
      tecnico.competencias = await tecnico.getCompetencias();
      tecnico.documentos = await tecnico.getDocumentos();

      logger.info(`Perfil de técnico consultado: ${id} por usuario ${req.user.id}`);
      sendSuccess(res, { tecnico }, 'Técnico obtenido exitosamente');

    } catch (error) {
      logger.error('Error al obtener técnico:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// POST /api/tecnicos - Crear nuevo técnico
router.post('/',
  authenticateToken,
  requireAdmin,
  validateRequest(createTecnicoSchema),
  async (req, res) => {
    try {
      const { usuario, perfil } = req.validatedData;

      const tecnico = await Tecnico.create(perfil || {}, usuario);

      logger.logAuth('tecnico_created', req.user.id, {
        tecnico_id: tecnico.id,
        email: usuario.email
      });

      sendSuccess(res, { tecnico }, 'Técnico creado exitosamente', 201);

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        if (error.message.includes('email')) {
          return sendError(res, 'Ya existe un usuario con este email', 409);
        }
        if (error.message.includes('numero_identificacion')) {
          return sendError(res, 'Ya existe un técnico con este número de identificación', 409);
        }
      }

      logger.error('Error al crear técnico:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// PUT /api/tecnicos/:id - Actualizar técnico
router.put('/:id',
  authenticateToken,
  requireRole('admin', 'tecnico'),
  validateRequest(updateTecnicoSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      // Los técnicos solo pueden actualizar su propio perfil
      if (req.user.rol === 'tecnico') {
        const tecnicoActual = await Tecnico.findByUserId(req.user.id);
        if (!tecnicoActual || tecnicoActual.id !== parseInt(id)) {
          return sendError(res, 'No tienes permisos para actualizar este perfil', 403);
        }
      }

      const tecnico = await Tecnico.update(id, req.validatedData);

      logger.info(`Técnico actualizado: ${id} por usuario ${req.user.id}`);
      sendSuccess(res, { tecnico }, 'Técnico actualizado exitosamente');

    } catch (error) {
      if (error.message === 'Técnico no encontrado') {
        return sendError(res, 'Técnico no encontrado', 404);
      }

      logger.error('Error al actualizar técnico:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// PATCH /api/tecnicos/:id/status - Cambiar estado del técnico
router.patch('/:id/status',
  authenticateToken,
  requireAdmin,
  validateRequest(changeStatusSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { estado } = req.validatedData;

      const tecnico = await Tecnico.changeStatus(id, estado);

      logger.logAuth('tecnico_status_changed', req.user.id, {
        tecnico_id: id,
        nuevo_estado: estado
      });

      sendSuccess(res, { tecnico }, 'Estado del técnico actualizado exitosamente');

    } catch (error) {
      if (error.message === 'Técnico no encontrado') {
        return sendError(res, 'Técnico no encontrado', 404);
      }

      logger.error('Error al cambiar estado del técnico:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// POST /api/tecnicos/:id/competencias - Agregar competencia al técnico
router.post('/:id/competencias',
  authenticateToken,
  requireRole('admin', 'tecnico'),
  validateRequest(addCompetenciaSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { competencia_id, nivel_actual, certificado } = req.validatedData;

      // Los técnicos solo pueden gestionar sus propias competencias
      if (req.user.rol === 'tecnico') {
        const tecnicoActual = await Tecnico.findByUserId(req.user.id);
        if (!tecnicoActual || tecnicoActual.id !== parseInt(id)) {
          return sendError(res, 'No tienes permisos para gestionar competencias de este perfil', 403);
        }
      }

      const tecnico = await Tecnico.findById(id);
      if (!tecnico) {
        return sendError(res, 'Técnico no encontrado', 404);
      }

      await tecnico.addCompetencia(competencia_id, nivel_actual, certificado);

      logger.info(`Competencia agregada: técnico ${id}, competencia ${competencia_id}`);
      sendSuccess(res, {}, 'Competencia agregada exitosamente');

    } catch (error) {
      logger.error('Error al agregar competencia:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// GET /api/tecnicos/:id/competencias - Obtener competencias del técnico
router.get('/:id/competencias',
  authenticateToken,
  requireRole('admin', 'tecnico', 'cliente'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const tecnico = await Tecnico.findById(id);
      if (!tecnico) {
        return sendError(res, 'Técnico no encontrado', 404);
      }

      const competencias = await tecnico.getCompetencias();
      sendSuccess(res, { competencias }, 'Competencias obtenidas exitosamente');

    } catch (error) {
      logger.error('Error al obtener competencias:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// POST /api/tecnicos/:id/documentos - Subir documento
router.post('/:id/documentos',
  authenticateToken,
  requireRole('admin', 'tecnico'),
  upload.single('archivo'),
  validateRequest(uploadDocumentoSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      if (!req.file) {
        return sendError(res, 'No se ha enviado ningún archivo', 400);
      }

      // Los técnicos solo pueden subir documentos a su propio perfil
      if (req.user.rol === 'tecnico') {
        const tecnicoActual = await Tecnico.findByUserId(req.user.id);
        if (!tecnicoActual || tecnicoActual.id !== parseInt(id)) {
          return sendError(res, 'No tienes permisos para subir documentos a este perfil', 403);
        }
      }

      const tecnico = await Tecnico.findById(id);
      if (!tecnico) {
        return sendError(res, 'Técnico no encontrado', 404);
      }

      // Guardar información del documento en la base de datos
      const { tipo_documento, descripcion, fecha_vencimiento } = req.validatedData;
      
      const database = require('../config/database');
      const [result] = await database.query(`
        INSERT INTO vf_tecnicos_documentos (
          tecnico_id, tipo_documento, nombre_archivo, ruta_archivo,
          tamaño_archivo, tipo_mime, descripcion, fecha_vencimiento
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id,
        tipo_documento,
        req.file.originalname,
        req.file.path,
        req.file.size,
        req.file.mimetype,
        descripcion || null,
        fecha_vencimiento || null
      ]);

      logger.info(`Documento subido: técnico ${id}, archivo ${req.file.originalname}`);
      sendSuccess(res, { 
        documento_id: result.insertId,
        filename: req.file.originalname 
      }, 'Documento subido exitosamente');

    } catch (error) {
      logger.error('Error al subir documento:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// GET /api/tecnicos/:id/documentos - Obtener documentos del técnico
router.get('/:id/documentos',
  authenticateToken,
  requireRole('admin', 'tecnico'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const tecnico = await Tecnico.findById(id);
      if (!tecnico) {
        return sendError(res, 'Técnico no encontrado', 404);
      }

      const documentos = await tecnico.getDocumentos();
      sendSuccess(res, { documentos }, 'Documentos obtenidos exitosamente');

    } catch (error) {
      logger.error('Error al obtener documentos:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// PATCH /api/tecnicos/:id/disponibilidad - Actualizar disponibilidad
router.patch('/:id/disponibilidad',
  authenticateToken,
  requireRole('admin', 'tecnico'),
  validateRequest(updateDisponibilidadSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { disponibilidad } = req.validatedData;

      // Los técnicos solo pueden actualizar su propia disponibilidad
      if (req.user.rol === 'tecnico') {
        const tecnicoActual = await Tecnico.findByUserId(req.user.id);
        if (!tecnicoActual || tecnicoActual.id !== parseInt(id)) {
          return sendError(res, 'No tienes permisos para actualizar la disponibilidad de este perfil', 403);
        }
      }

      const tecnico = await Tecnico.update(id, { disponibilidad });

      logger.info(`Disponibilidad actualizada: técnico ${id} -> ${disponibilidad}`);
      sendSuccess(res, { tecnico }, 'Disponibilidad actualizada exitosamente');

    } catch (error) {
      logger.error('Error al actualizar disponibilidad:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

module.exports = router;