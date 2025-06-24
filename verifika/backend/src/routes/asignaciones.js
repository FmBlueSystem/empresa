// asignaciones.js - Rutas para gestión de asignaciones (FASE 2.4 - placeholder)
const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { sendSuccess } = require('../middleware/errorHandler');

const router = express.Router();

// Placeholder routes - Se implementarán en FASE 2.4
router.get('/', authenticateToken, (req, res) => {
  sendSuccess(res, { asignaciones: [] }, 'Módulo de asignaciones en desarrollo - FASE 2.4');
});

router.post('/', authenticateToken, requireAdmin, (req, res) => {
  sendSuccess(res, {}, 'Crear asignación - disponible en FASE 2.4');
});

module.exports = router;