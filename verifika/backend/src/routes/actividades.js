// actividades.js - Rutas para gestión de actividades (FASE 2.6 - placeholder)
const express = require('express');
const { authenticateToken, requireTecnico, requireActivityValidator } = require('../middleware/auth');
const { sendSuccess } = require('../middleware/errorHandler');

const router = express.Router();

// Placeholder routes - Se implementarán en FASE 2.6
router.get('/', authenticateToken, (req, res) => {
  sendSuccess(res, { actividades: [] }, 'Módulo de actividades en desarrollo - FASE 2.6');
});

router.post('/', authenticateToken, requireTecnico, (req, res) => {
  sendSuccess(res, {}, 'Crear actividad - disponible en FASE 2.6');
});

module.exports = router;