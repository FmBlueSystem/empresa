// validaciones.js - Rutas para gestión de validaciones (FASE 2.7 - placeholder)
const express = require('express');
const { authenticateToken, requireActivityValidator } = require('../middleware/auth');
const { sendSuccess } = require('../middleware/errorHandler');

const router = express.Router();

// Placeholder routes - Se implementarán en FASE 2.7
router.get('/', authenticateToken, requireActivityValidator, (req, res) => {
  sendSuccess(res, { validaciones: [] }, 'Módulo de validaciones en desarrollo - FASE 2.7');
});

router.post('/', authenticateToken, requireActivityValidator, (req, res) => {
  sendSuccess(res, {}, 'Crear validación - disponible en FASE 2.7');
});

module.exports = router;