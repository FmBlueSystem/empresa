// Usuario.js - Modelo para el sistema de usuarios de Verifika
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const database = require('../config/database');
const logger = require('../config/logger');

class Usuario {
  constructor(data = {}) {
    this.id = data.id;
    this.email = data.email;
    this.password_hash = data.password_hash;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.telefono = data.telefono;
    this.rol = data.rol;
    this.estado = data.estado || 'pendiente';
    this.email_verificado = data.email_verificado || false;
    this.fecha_ultimo_login = data.fecha_ultimo_login;
    this.fecha_creacion = data.fecha_creacion;
    this.fecha_actualizacion = data.fecha_actualizacion;
    this.creado_por = data.creado_por;
    this.metadatos = data.metadatos;
  }

  // Métodos estáticos para consultas de base de datos
  static async findByEmail(email) {
    try {
      if (!email) {
        logger.error('Email no proporcionado en findByEmail');
        return null;
      }
      
      const query = 'SELECT * FROM vf_usuarios WHERE email = ? AND estado != "eliminado"';
      const rows = await database.query(query, [email]);
      
      if (!rows || rows.length === 0) {
        return null;
      }
      
      return new Usuario(rows[0]);
    } catch (error) {
      logger.error('Error al buscar usuario por email:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const query = 'SELECT * FROM vf_usuarios WHERE id = ? AND estado != "eliminado"';
      const rows = await database.query(query, [id]);
      
      if (rows.length === 0) {
        return null;
      }
      
      return new Usuario(rows[0]);
    } catch (error) {
      logger.error('Error al buscar usuario por ID:', error);
      throw error;
    }
  }

  static async findAll(filters = {}) {
    try {
      let query = 'SELECT * FROM vf_usuarios WHERE estado != "eliminado"';
      const params = [];

      // Aplicar filtros
      if (filters.rol) {
        query += ' AND rol = ?';
        params.push(filters.rol);
      }

      if (filters.estado) {
        query += ' AND estado = ?';
        params.push(filters.estado);
      }

      if (filters.search) {
        query += ' AND (nombre LIKE ? OR apellido LIKE ? OR email LIKE ?)';
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm, searchTerm);
      }

      // Ordenamiento
      query += ' ORDER BY fecha_creacion DESC';

      // Paginación
      if (filters.limit) {
        query += ' LIMIT ?';
        params.push(parseInt(filters.limit));
        
        if (filters.offset) {
          query += ' OFFSET ?';
          params.push(parseInt(filters.offset));
        }
      }

      const rows = await database.query(query, params);
      return rows.map(row => new Usuario(row));
    } catch (error) {
      logger.error('Error al obtener usuarios:', error);
      throw error;
    }
  }

  static async create(userData, createdBy = null) {
    try {
      // Validar que el email no exista
      const existingUser = await Usuario.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Hash de la contraseña
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(userData.password, saltRounds);

      const query = `
        INSERT INTO vf_usuarios (
          email, password_hash, nombre, apellido, telefono, 
          rol, estado, creado_por, metadatos
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        userData.email,
        password_hash,
        userData.nombre,
        userData.apellido,
        userData.telefono || null,
        userData.rol,
        userData.estado || 'pendiente',
        createdBy,
        userData.metadatos ? JSON.stringify(userData.metadatos) : null
      ];

      const result = await database.query(query, params);
      const userId = result.insertId;

      logger.logAuth('user_created', userId, {
        email: userData.email,
        rol: userData.rol,
        createdBy
      });

      return await Usuario.findById(userId);
    } catch (error) {
      logger.error('Error al crear usuario:', error);
      throw error;
    }
  }

  // Métodos de instancia
  async save() {
    try {
      if (this.id) {
        // Actualizar usuario existente
        const query = `
          UPDATE vf_usuarios 
          SET nombre = ?, apellido = ?, telefono = ?, estado = ?, 
              email_verificado = ?, metadatos = ?
          WHERE id = ?
        `;
        
        const params = [
          this.nombre,
          this.apellido,
          this.telefono,
          this.estado,
          this.email_verificado,
          this.metadatos ? JSON.stringify(this.metadatos) : null,
          this.id
        ];

        await database.query(query, params);
        
        logger.logAuth('user_updated', this.id, {
          email: this.email,
          estado: this.estado
        });

        return true;
      } else {
        throw new Error('No se puede guardar usuario sin ID');
      }
    } catch (error) {
      logger.error('Error al guardar usuario:', error);
      throw error;
    }
  }

  async updatePassword(newPassword) {
    try {
      const saltRounds = 12;
      const password_hash = await bcrypt.hash(newPassword, saltRounds);

      const query = 'UPDATE vf_usuarios SET password_hash = ? WHERE id = ?';
      await database.query(query, [password_hash, this.id]);

      logger.logAuth('password_updated', this.id, { email: this.email });
      return true;
    } catch (error) {
      logger.error('Error al actualizar contraseña:', error);
      throw error;
    }
  }

  async verifyPassword(password) {
    try {
      // Validar que tenemos tanto la contraseña como el hash
      if (!password || !this.password_hash) {
        logger.error('Error al verificar contraseña: password o password_hash undefined', {
          hasPassword: !!password,
          hasHash: !!this.password_hash
        });
        return false;
      }
      
      return await bcrypt.compare(password, this.password_hash);
    } catch (error) {
      logger.error('Error al verificar contraseña:', error);
      return false;
    }
  }

  async updateLastLogin() {
    try {
      const query = 'UPDATE vf_usuarios SET fecha_ultimo_login = NOW() WHERE id = ?';
      await database.query(query, [this.id]);
      this.fecha_ultimo_login = new Date();
      
      logger.logAuth('login_success', this.id, { email: this.email });
    } catch (error) {
      logger.error('Error al actualizar último login:', error);
    }
  }

  generateJWT() {
    try {
      const payload = {
        id: this.id,
        email: this.email,
        nombre: this.nombre,
        apellido: this.apellido,
        rol: this.rol,
        estado: this.estado,
        iat: Math.floor(Date.now() / 1000)
      };

      const options = {
        expiresIn: process.env.JWT_EXPIRES_IN || '24h',
        issuer: 'verifika-api',
        audience: `user-${this.id}`
      };

      return jwt.sign(payload, process.env.JWT_SECRET, options);
    } catch (error) {
      logger.error('Error al generar JWT:', error);
      throw error;
    }
  }

  static verifyJWT(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Token expirado');
      } else if (error.name === 'JsonWebTokenError') {
        throw new Error('Token inválido');
      } else {
        throw new Error('Error al verificar token');
      }
    }
  }

  // Métodos de utilidad
  toJSON() {
    const user = { ...this };
    delete user.password_hash; // Nunca enviar el hash de contraseña
    return user;
  }

  get nombreCompleto() {
    return `${this.nombre} ${this.apellido}`;
  }

  get esActivo() {
    return this.estado === 'activo';
  }

  get esAdmin() {
    return this.rol === 'admin';
  }

  get esTecnico() {
    return this.rol === 'tecnico';
  }

  get esCliente() {
    return this.rol === 'cliente';
  }

  get esValidador() {
    return this.rol === 'validador';
  }

  // Métodos para roles y permisos
  puedeCrearUsuarios() {
    return this.rol === 'admin';
  }

  puedeGestionarTecnicos() {
    return this.rol === 'admin';
  }

  puedeGestionarClientes() {
    return this.rol === 'admin';
  }

  puedeValidarActividades() {
    return this.rol === 'validador' || this.rol === 'admin';
  }

  puedeCrearActividades() {
    return this.rol === 'tecnico';
  }

  // Método para soft delete
  async delete() {
    try {
      const query = 'UPDATE vf_usuarios SET estado = "eliminado" WHERE id = ?';
      await database.query(query, [this.id]);
      
      logger.logAuth('user_deleted', this.id, { email: this.email });
      return true;
    } catch (error) {
      logger.error('Error al eliminar usuario:', error);
      throw error;
    }
  }

  // Estadísticas del usuario
  static async getStats() {
    try {
      const query = `
        SELECT 
          rol,
          estado,
          COUNT(*) as total
        FROM vf_usuarios 
        WHERE estado != 'eliminado'
        GROUP BY rol, estado
        ORDER BY rol, estado
      `;

      const rows = await database.query(query);
      return rows;
    } catch (error) {
      logger.error('Error al obtener estadísticas de usuarios:', error);
      throw error;
    }
  }
}

module.exports = Usuario;