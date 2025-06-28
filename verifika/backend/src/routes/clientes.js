// clientes.js - Rutas para gestión de clientes en Verifika
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const Cliente = require('../models/Cliente');
const { 
  authenticateToken, 
  requireAdmin, 
  requireOwnerOrAdmin 
} = require('../middleware/auth');
const { 
  AppError, 
  ValidationError, 
  NotFoundError,
  DuplicateError,
  asyncHandler,
  validateRequest,
  sendSuccess
} = require('../middleware/errorHandler');
const {
  createClienteSchema,
  updateClienteSchema,
  getClientesQuerySchema,
  changeStatusSchema,
  asignarValidadorSchema,
  createProyectoSchema,
  idParamSchema
} = require('../validators/clienteValidators');

const router = express.Router();

// Configuración de Multer para documentos de clientes
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../uploads/clientes');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const clienteId = req.params.id || 'nuevo';
    cb(null, `cliente-${clienteId}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido. Solo se permiten: JPG, PNG, GIF, PDF, DOC, DOCX'));
    }
  }
});

// ============================================
// RUTAS PÚBLICAS (solo lectura con autenticación)
// ============================================

// GET /api/clientes - Listar clientes con filtros
router.get('/',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const query = getClientesQuerySchema.validate(req.query).value;
    
    // Calcular offset para paginación
    const offset = (query.page - 1) * query.limit;
    
    const filtros = {
      estado: query.estado,
      tipo_cliente: query.tipo_cliente,
      sector_industria: query.sector_industria,
      tamaño_empresa: query.tamaño_empresa,
      ciudad: query.ciudad,
      search: query.search,
      sort: query.sort,
      order: query.order,
      limit: query.limit,
      offset: offset
    };

    const clientes = await Cliente.findAll(filtros);
    
    // Para paginación completa, necesitaríamos un count total
    // Por simplicidad, usamos la longitud actual
    const hasMore = clientes.length === query.limit;

    sendSuccess(res, {
      clientes: clientes.map(cliente => cliente.toJSON()),
      pagination: {
        page: query.page,
        limit: query.limit,
        hasMore,
        total: clientes.length
      },
      filtros: {
        estado: query.estado,
        tipo_cliente: query.tipo_cliente,
        sector_industria: query.sector_industria,
        tamaño_empresa: query.tamaño_empresa,
        ciudad: query.ciudad,
        search: query.search
      }
    }, 'Clientes obtenidos exitosamente');
  })
);

// GET /api/clientes/active - Obtener clientes activos para asignaciones
router.get('/active',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const clientesActivos = await Cliente.findActive();

    sendSuccess(res, {
      clientes: clientesActivos.map(cliente => cliente.toJSON())
    }, 'Clientes activos obtenidos exitosamente');
  })
);

// GET /api/clientes/stats - Estadísticas de clientes (solo admin)
router.get('/stats',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const stats = await Cliente.getStats();

    sendSuccess(res, {
      stats
    }, 'Estadísticas de clientes obtenidas exitosamente');
  })
);

// GET /api/clientes/:id - Obtener cliente específico
router.get('/:id',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    // Solo admin o cliente propietario puede ver detalles completos
    if (!req.user.esAdmin && req.user.email !== cliente.email && req.user.email !== cliente.email_contacto) {
      // Devolver información limitada para no-propietarios
      const clienteLimitado = {
        id: cliente.id,
        razon_social: cliente.razon_social,
        nombre_comercial: cliente.nombre_comercial,
        tipo_cliente: cliente.tipo_cliente,
        ciudad: cliente.ciudad,
        provincia: cliente.provincia,
        sector_industria: cliente.sector_industria,
        tamaño_empresa: cliente.tamaño_empresa,
        estado: cliente.estado
      };
      
      return sendSuccess(res, { cliente: clienteLimitado }, 'Cliente obtenido exitosamente');
    }

    sendSuccess(res, {
      cliente: cliente.toJSON()
    }, 'Cliente obtenido exitosamente');
  })
);

// ============================================
// RUTAS PROTEGIDAS (requieren admin)
// ============================================

// POST /api/clientes - Crear nuevo cliente
router.post('/',
  authenticateToken,
  requireAdmin,
  validateRequest(createClienteSchema),
  asyncHandler(async (req, res) => {
    try {
      const cliente = await Cliente.create(req.body, req.user.id);

      sendSuccess(res, {
        cliente: cliente.toJSON()
      }, 'Cliente creado exitosamente', 201);
    } catch (error) {
      if (error.message.includes('ya existe')) {
        throw new DuplicateError(error.message);
      }
      throw error;
    }
  })
);

// PUT /api/clientes/:id - Actualizar cliente
router.put('/:id',
  authenticateToken,
  requireAdmin,
  validateRequest(idParamSchema, 'params'),
  validateRequest(updateClienteSchema),
  asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    await cliente.update(req.body);

    sendSuccess(res, {
      cliente: cliente.toJSON()
    }, 'Cliente actualizado exitosamente');
  })
);

// PATCH /api/clientes/:id/status - Cambiar estado del cliente
router.patch('/:id/status',
  authenticateToken,
  requireAdmin,
  validateRequest(idParamSchema, 'params'),
  validateRequest(changeStatusSchema),
  asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    await cliente.changeStatus(req.body.estado, req.user.id);

    sendSuccess(res, {
      cliente: cliente.toJSON()
    }, 'Estado del cliente actualizado exitosamente');
  })
);

// DELETE /api/clientes/:id - Eliminar cliente (soft delete)
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    await cliente.delete();

    sendSuccess(res, {}, 'Cliente eliminado exitosamente');
  })
);

// ============================================
// RUTAS DE PROYECTOS DEL CLIENTE
// ============================================

// GET /api/clientes/:id/proyectos - Obtener proyectos del cliente
router.get('/:id/proyectos',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    const filtros = {
      estado: req.query.estado,
      limit: req.query.limit,
      offset: req.query.offset
    };

    const proyectos = await cliente.getProyectos(filtros);

    sendSuccess(res, {
      proyectos,
      cliente_info: {
        id: cliente.id,
        razon_social: cliente.razon_social,
        nombre_comercial: cliente.nombre_comercial
      }
    }, 'Proyectos del cliente obtenidos exitosamente');
  })
);

// POST /api/clientes/:id/proyectos - Crear proyecto para el cliente
router.post('/:id/proyectos',
  authenticateToken,
  requireAdmin,
  validateRequest(idParamSchema, 'params'),
  validateRequest(createProyectoSchema),
  asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    // Por ahora, simular creación de proyecto
    // En implementación real, habría un modelo Proyecto
    const proyectoData = {
      ...req.body,
      cliente_id: cliente.id,
      creado_por: req.user.id
    };

    sendSuccess(res, {
      proyecto: {
        id: Date.now(), // ID temporal
        ...proyectoData,
        fecha_creacion: new Date().toISOString()
      },
      cliente_info: {
        id: cliente.id,
        razon_social: cliente.razon_social
      }
    }, 'Proyecto creado exitosamente', 201);
  })
);

// ============================================
// RUTAS DE VALIDADORES DEL CLIENTE
// ============================================

// GET /api/clientes/:id/validadores - Obtener validadores del cliente
router.get('/:id/validadores',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    const validadores = await cliente.getValidadores();

    sendSuccess(res, {
      validadores,
      cliente_info: {
        id: cliente.id,
        razon_social: cliente.razon_social
      }
    }, 'Validadores del cliente obtenidos exitosamente');
  })
);

// POST /api/clientes/:id/validadores - Asignar validador al cliente
router.post('/:id/validadores',
  authenticateToken,
  requireAdmin,
  validateRequest(idParamSchema, 'params'),
  validateRequest(asignarValidadorSchema),
  asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    try {
      await cliente.asignarValidador(req.body.usuario_id, req.user.id);

      sendSuccess(res, {
        cliente_id: cliente.id,
        usuario_id: req.body.usuario_id,
        asignado_por: req.user.id
      }, 'Validador asignado exitosamente');
    } catch (error) {
      if (error.message.includes('ya está asignado')) {
        throw new ValidationError(error.message);
      }
      throw error;
    }
  })
);

// ============================================
// RUTAS DE DOCUMENTOS DEL CLIENTE
// ============================================

// POST /api/clientes/:id/documentos - Subir documento del cliente
router.post('/:id/documentos',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  upload.single('documento'),
  asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    // Solo admin o cliente propietario puede subir documentos
    if (!req.user.esAdmin && req.user.email !== cliente.email && req.user.email !== cliente.email_contacto) {
      throw new AppError('No tiene permisos para subir documentos de este cliente', 403);
    }

    if (!req.file) {
      throw new ValidationError('No se proporcionó ningún archivo');
    }

    // Simular guardado de metadatos del documento en base de datos
    const documentoData = {
      id: Date.now(),
      cliente_id: cliente.id,
      nombre_original: req.file.originalname,
      nombre_archivo: req.file.filename,
      ruta_archivo: req.file.path,
      tamaño: req.file.size,
      tipo_mime: req.file.mimetype,
      tipo_documento: req.body.tipo_documento || 'otro',
      descripcion: req.body.descripcion || null,
      subido_por: req.user.id,
      fecha_subida: new Date().toISOString()
    };

    sendSuccess(res, {
      documento: documentoData,
      cliente_info: {
        id: cliente.id,
        razon_social: cliente.razon_social
      }
    }, 'Documento subido exitosamente', 201);
  })
);

// GET /api/clientes/:id/documentos - Obtener documentos del cliente
router.get('/:id/documentos',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    // Solo admin o cliente propietario puede ver documentos
    if (!req.user.esAdmin && req.user.email !== cliente.email && req.user.email !== cliente.email_contacto) {
      throw new AppError('No tiene permisos para ver documentos de este cliente', 403);
    }

    // Simular lista de documentos
    const documentos = [
      {
        id: 1,
        cliente_id: cliente.id,
        nombre_original: 'contrato_ejemplo.pdf',
        tipo_documento: 'contrato',
        descripcion: 'Contrato de servicios',
        tamaño: 245760,
        fecha_subida: new Date().toISOString()
      }
    ];

    sendSuccess(res, {
      documentos,
      cliente_info: {
        id: cliente.id,
        razon_social: cliente.razon_social
      }
    }, 'Documentos del cliente obtenidos exitosamente');
  })
);

// ============================================
// RUTAS DE ESTADÍSTICAS DEL CLIENTE
// ============================================

// GET /api/clientes/:id/estadisticas - Obtener estadísticas del cliente
router.get('/:id/estadisticas',
  authenticateToken,
  validateRequest(idParamSchema, 'params'),
  asyncHandler(async (req, res) => {
    const cliente = await Cliente.findById(req.params.id);
    
    if (!cliente) {
      throw new NotFoundError('Cliente');
    }

    const estadisticas = await cliente.getEstadisticas();

    sendSuccess(res, {
      estadisticas,
      cliente_info: {
        id: cliente.id,
        razon_social: cliente.razon_social,
        estado: cliente.estado
      }
    }, 'Estadísticas del cliente obtenidas exitosamente');
  })
);

// ============================================
// RUTAS DE BÚSQUEDA AVANZADA
// ============================================

// GET /api/clientes/search/advanced - Búsqueda avanzada de clientes
router.get('/search/advanced',
  authenticateToken,
  asyncHandler(async (req, res) => {
    const {
      razon_social,
      identificacion,
      email,
      telefono,
      ciudad,
      sector,
      tamaño,
      estado,
      fecha_desde,
      fecha_hasta
    } = req.query;

    // Construir filtros dinámicos
    const filtros = {};
    
    if (razon_social) filtros.search = razon_social;
    if (estado) filtros.estado = estado;
    if (ciudad) filtros.ciudad = ciudad;
    if (sector) filtros.sector_industria = sector;
    if (tamaño) filtros.tamaño_empresa = tamaño;

    const clientes = await Cliente.findAll(filtros);

    // Filtrado adicional (simulado)
    let clientesFiltrados = clientes;

    if (identificacion) {
      clientesFiltrados = clientesFiltrados.filter(c => 
        c.identificacion?.includes(identificacion)
      );
    }

    if (email) {
      clientesFiltrados = clientesFiltrados.filter(c => 
        c.email?.includes(email) || c.email_contacto?.includes(email)
      );
    }

    if (telefono) {
      clientesFiltrados = clientesFiltrados.filter(c => 
        c.telefono?.includes(telefono) || c.telefono_contacto?.includes(telefono)
      );
    }

    sendSuccess(res, {
      clientes: clientesFiltrados.map(cliente => cliente.toJSON()),
      total: clientesFiltrados.length,
      criterios_busqueda: {
        razon_social,
        identificacion,
        email,
        telefono,
        ciudad,
        sector,
        tamaño,
        estado,
        fecha_desde,
        fecha_hasta
      }
    }, 'Búsqueda avanzada completada exitosamente');
  })
);

// ============================================
// RUTAS DE EXPORTACIÓN
// ============================================

// GET /api/clientes/export/csv - Exportar clientes a CSV
router.get('/export/csv',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const clientes = await Cliente.findAll({ estado: 'activo' });
    
    // Headers CSV
    const headers = [
      'ID', 'Razón Social', 'Nombre Comercial', 'Tipo Cliente', 'Identificación',
      'Email', 'Teléfono', 'Ciudad', 'Provincia', 'Sector Industria',
      'Tamaño Empresa', 'Estado', 'Fecha Creación'
    ];

    // Convertir datos a CSV
    const csvData = clientes.map(cliente => [
      cliente.id,
      cliente.razon_social,
      cliente.nombre_comercial || '',
      cliente.tipo_cliente,
      cliente.identificacion,
      cliente.email,
      cliente.telefono,
      cliente.ciudad,
      cliente.provincia,
      cliente.sector_industria || '',
      cliente.tamaño_empresa,
      cliente.estado,
      cliente.fecha_creacion
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=clientes.csv');
    res.send(csvContent);
  })
);

module.exports = router;
