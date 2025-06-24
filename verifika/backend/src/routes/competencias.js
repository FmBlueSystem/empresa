// competencias.js - Rutas para gestión del catálogo de competencias
const express = require('express');

const { authenticateToken, requireAdmin, requireRole } = require('../middleware/auth');
const { sendSuccess, sendError } = require('../middleware/errorHandler');
const logger = require('../config/logger');

// Modelos
const Competencia = require('../models/Competencia');

// Validadores
const {
  createCompetenciaSchema,
  updateCompetenciaSchema,
  searchCompetenciasSchema,
  changeStatusSchema,
  validateRequest,
  validateQuery
} = require('../validators/competenciaValidators');

const router = express.Router();

// GET /api/competencias - Listar competencias con filtros y paginación
router.get('/', 
  authenticateToken, 
  validateQuery(searchCompetenciasSchema),
  async (req, res) => {
    try {
      const options = req.validatedQuery;
      const result = await Competencia.findAll(options);

      logger.info(`Listado de competencias solicitado por usuario ${req.user.id}`, {
        filtros: options,
        resultados: result.competencias.length
      });

      sendSuccess(res, result, 'Competencias obtenidas exitosamente');

    } catch (error) {
      logger.error('Error al listar competencias:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// GET /api/competencias/categories - Obtener categorías disponibles
router.get('/categories',
  authenticateToken,
  async (req, res) => {
    try {
      const categories = await Competencia.getCategories();
      sendSuccess(res, { categories }, 'Categorías obtenidas exitosamente');

    } catch (error) {
      logger.error('Error al obtener categorías:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// GET /api/competencias/stats - Estadísticas de competencias
router.get('/stats',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const stats = await Competencia.getStats();
      sendSuccess(res, { stats }, 'Estadísticas obtenidas exitosamente');

    } catch (error) {
      logger.error('Error al obtener estadísticas de competencias:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// GET /api/competencias/most-demanded - Competencias más demandadas
router.get('/most-demanded',
  authenticateToken,
  requireRole('admin', 'cliente'),
  async (req, res) => {
    try {
      const limit = parseInt(req.query.limit) || 10;
      const competencias = await Competencia.getMostDemanded(limit);
      
      sendSuccess(res, { competencias }, 'Competencias más demandadas obtenidas exitosamente');

    } catch (error) {
      logger.error('Error al obtener competencias más demandadas:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// GET /api/competencias/:id - Obtener competencia específica
router.get('/:id',
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      const competencia = await Competencia.findById(id);
      if (!competencia) {
        return sendError(res, 'Competencia no encontrada', 404);
      }

      // Solo admins pueden ver técnicos asignados
      if (req.user.rol === 'admin') {
        competencia.tecnicos = await competencia.getTecnicos();
      }

      logger.info(`Competencia consultada: ${id} por usuario ${req.user.id}`);
      sendSuccess(res, { competencia }, 'Competencia obtenida exitosamente');

    } catch (error) {
      logger.error('Error al obtener competencia:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// POST /api/competencias - Crear nueva competencia
router.post('/',
  authenticateToken,
  requireAdmin,
  validateRequest(createCompetenciaSchema),
  async (req, res) => {
    try {
      // Verificar que no exista una competencia con el mismo nombre
      const existingCompetencia = await Competencia.findByName(req.validatedData.nombre);
      if (existingCompetencia) {
        return sendError(res, 'Ya existe una competencia con este nombre', 409);
      }

      const competencia = await Competencia.create(req.validatedData);

      logger.info(`Competencia creada: ${competencia.nombre} por usuario ${req.user.id}`);
      sendSuccess(res, { competencia }, 'Competencia creada exitosamente', 201);

    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        return sendError(res, 'Ya existe una competencia con este nombre', 409);
      }

      logger.error('Error al crear competencia:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// PUT /api/competencias/:id - Actualizar competencia
router.put('/:id',
  authenticateToken,
  requireAdmin,
  validateRequest(updateCompetenciaSchema),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Si se está actualizando el nombre, verificar que no exista otra con el mismo nombre
      if (req.validatedData.nombre) {
        const existingCompetencia = await Competencia.findByName(req.validatedData.nombre);
        if (existingCompetencia && existingCompetencia.id !== parseInt(id)) {
          return sendError(res, 'Ya existe una competencia con este nombre', 409);
        }
      }

      const competencia = await Competencia.update(id, req.validatedData);

      logger.info(`Competencia actualizada: ${id} por usuario ${req.user.id}`);
      sendSuccess(res, { competencia }, 'Competencia actualizada exitosamente');

    } catch (error) {
      if (error.message === 'Competencia no encontrada') {
        return sendError(res, 'Competencia no encontrada', 404);
      }

      if (error.code === 'ER_DUP_ENTRY') {
        return sendError(res, 'Ya existe una competencia con este nombre', 409);
      }

      logger.error('Error al actualizar competencia:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// PATCH /api/competencias/:id/status - Cambiar estado de la competencia
router.patch('/:id/status',
  authenticateToken,
  requireAdmin,
  validateRequest(changeStatusSchema),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { activo } = req.validatedData;

      const competencia = await Competencia.update(id, { activo });

      logger.info(`Estado de competencia cambiado: ${id} -> ${activo ? 'activa' : 'inactiva'} por usuario ${req.user.id}`);
      sendSuccess(res, { competencia }, 'Estado de la competencia actualizado exitosamente');

    } catch (error) {
      if (error.message === 'Competencia no encontrada') {
        return sendError(res, 'Competencia no encontrada', 404);
      }

      logger.error('Error al cambiar estado de competencia:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// DELETE /api/competencias/:id - Eliminar competencia
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const { id } = req.params;

      await Competencia.delete(id);

      logger.info(`Competencia eliminada: ${id} por usuario ${req.user.id}`);
      sendSuccess(res, {}, 'Competencia eliminada exitosamente');

    } catch (error) {
      if (error.message === 'Competencia no encontrada') {
        return sendError(res, 'Competencia no encontrada', 404);
      }

      if (error.message.includes('técnicos asignados')) {
        return sendError(res, 'No se puede eliminar la competencia porque tiene técnicos asignados', 409);
      }

      logger.error('Error al eliminar competencia:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

// GET /api/competencias/:id/tecnicos - Obtener técnicos con esta competencia
router.get('/:id/tecnicos',
  authenticateToken,
  requireRole('admin', 'cliente'),
  async (req, res) => {
    try {
      const { id } = req.params;

      const competencia = await Competencia.findById(id);
      if (!competencia) {
        return sendError(res, 'Competencia no encontrada', 404);
      }

      const tecnicos = await competencia.getTecnicos();

      sendSuccess(res, { tecnicos }, 'Técnicos con competencia obtenidos exitosamente');

    } catch (error) {
      logger.error('Error al obtener técnicos con competencia:', error);
      sendError(res, 'Error interno del servidor', 500);
    }
  }
);

module.exports = router;