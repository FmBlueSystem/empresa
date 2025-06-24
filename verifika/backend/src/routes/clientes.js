// clientes.js - Rutas para gestión de clientes (FASE 2.3 - placeholder)
const express = require('express');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { sendSuccess } = require('../middleware/errorHandler');

const router = express.Router();

// Placeholder routes - Se implementarán en FASE 2.3
router.get('/', authenticateToken, requireAdmin, (req, res) => {
  sendSuccess(res, { clientes: [] }, 'Módulo de clientes en desarrollo - FASE 2.3');
});

router.post('/', authenticateToken, requireAdmin, (req, res) => {
  sendSuccess(res, {}, 'Crear cliente - disponible en FASE 2.3');
});

module.exports = router;