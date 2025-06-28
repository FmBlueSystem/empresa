// Tecnico.js - Modelo para gestión de técnicos en Verifika
const database = require('../config/database');
const logger = require('../config/logger');

class Tecnico {
  constructor(data = {}) {
    this.id = data.id;
    this.usuario_id = data.usuario_id;
    this.numero_identificacion = data.numero_identificacion;
    this.fecha_nacimiento = data.fecha_nacimiento;
    this.direccion = data.direccion;
    this.ciudad = data.ciudad;
    this.pais = data.pais || 'España';
    this.experiencia_anos = data.experiencia_anos || 0;
    this.nivel_experiencia = data.nivel_experiencia || 'junior';
    this.disponibilidad = data.disponibilidad || 'disponible';
    this.tarifa_por_hora = data.tarifa_por_hora;
    this.moneda = data.moneda || 'EUR';
    this.biografia = data.biografia;
    this.foto_perfil = data.foto_perfil;
    this.fecha_creacion = data.fecha_creacion;
    this.fecha_actualizacion = data.fecha_actualizacion;
    
    // Campos del usuario relacionado
    this.email = data.email;
    this.nombre = data.nombre;
    this.apellido = data.apellido;
    this.telefono = data.telefono;
    this.estado = data.estado;
  }

  // Crear nuevo técnico
  static async create(tecnicoData, usuarioData) {
    const connection = await database.beginTransaction();
    
    try {
      // 1. Crear usuario si no existe
      let usuario_id = usuarioData.usuario_id;
      
      if (!usuario_id) {
        const bcrypt = require('bcryptjs');
        const hashedPassword = await bcrypt.hash(usuarioData.password || 'temp123', 10);
        
        const usuarioResult = await connection.query(`
          INSERT INTO vf_usuarios (email, password_hash, nombre, apellido, telefono, rol, estado, email_verificado)
          VALUES (?, ?, ?, ?, ?, 'tecnico', 'pendiente', FALSE)
        `, [
          usuarioData.email,
          hashedPassword,
          usuarioData.nombre,
          usuarioData.apellido,
          usuarioData.telefono || null
        ]);
        
        usuario_id = Array.isArray(usuarioResult) ? usuarioResult[0].insertId : usuarioResult.insertId;
        logger.info(`Usuario técnico creado con ID: ${usuario_id}`);
      }

      // 2. Crear perfil técnico
      const result = await connection.query(`
        INSERT INTO vf_tecnicos_perfiles (
          usuario_id, numero_identificacion, fecha_nacimiento, direccion, ciudad, pais,
          experiencia_anos, nivel_experiencia, disponibilidad, tarifa_por_hora, moneda, biografia
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        usuario_id,
        tecnicoData.numero_identificacion || null,
        tecnicoData.fecha_nacimiento || null,
        tecnicoData.direccion || null,
        tecnicoData.ciudad || null,
        tecnicoData.pais || 'España',
        tecnicoData.experiencia_anos || 0,
        tecnicoData.nivel_experiencia || 'junior',
        tecnicoData.disponibilidad || 'disponible',
        tecnicoData.tarifa_por_hora || null,
        tecnicoData.moneda || 'EUR',
        tecnicoData.biografia || null
      ]);

      await database.commitTransaction(connection);
      
      const insertId = Array.isArray(result) ? result[0].insertId : result.insertId;
      const tecnico = await this.findById(insertId);
      logger.info(`Técnico creado exitosamente: ${tecnico.nombre_completo}`);
      
      return tecnico;
      
    } catch (error) {
      await database.rollbackTransaction(connection);
      logger.error('Error creando técnico:', error);
      throw error;
    }
  }

  // Buscar técnico por ID
  static async findById(id) {
    try {
      const [rows] = await database.query(`
        SELECT 
          tp.*,
          u.email, u.nombre, u.apellido, u.telefono, u.estado, u.email_verificado,
          u.fecha_ultimo_login, u.fecha_creacion as usuario_fecha_creacion
        FROM vf_tecnicos_perfiles tp
        INNER JOIN vf_usuarios u ON tp.usuario_id = u.id
        WHERE tp.id = ?
      `, [id]);

      if (!rows || rows.length === 0) return null;

      const tecnico = new Tecnico(rows[0]);
      tecnico.nombre_completo = `${tecnico.nombre} ${tecnico.apellido}`;
      
      return tecnico;
    } catch (error) {
      logger.error('Error buscando técnico por ID:', error);
      throw error;
    }
  }

  // Buscar técnico por usuario_id
  static async findByUserId(usuario_id) {
    try {
      const [rows] = await database.query(`
        SELECT 
          tp.*,
          u.email, u.nombre, u.apellido, u.telefono, u.estado, u.email_verificado
        FROM vf_tecnicos_perfiles tp
        INNER JOIN vf_usuarios u ON tp.usuario_id = u.id
        WHERE tp.usuario_id = ?
      `, [usuario_id]);

      if (rows.length === 0) return null;
      
      const tecnico = new Tecnico(rows[0]);
      tecnico.nombre_completo = `${tecnico.nombre} ${tecnico.apellido}`;
      
      return tecnico;
    } catch (error) {
      logger.error('Error buscando técnico por usuario_id:', error);
      throw error;
    }
  }

  // Listar técnicos con filtros y paginación
  static async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 10,
        disponibilidad,
        nivel_experiencia,
        ciudad,
        competencia_id,
        search
      } = options;

      const offset = (page - 1) * limit;
      let whereClause = 'WHERE 1=1';
      let joinClause = '';
      const params = [];

      // Filtros
      if (disponibilidad) {
        whereClause += ' AND tp.disponibilidad = ?';
        params.push(disponibilidad);
      }

      if (nivel_experiencia) {
        whereClause += ' AND tp.nivel_experiencia = ?';
        params.push(nivel_experiencia);
      }

      if (ciudad) {
        whereClause += ' AND tp.ciudad LIKE ?';
        params.push(`%${ciudad}%`);
      }

      if (competencia_id) {
        joinClause += ' INNER JOIN vf_tecnicos_competencias tc ON tp.id = tc.tecnico_id';
        whereClause += ' AND tc.competencia_id = ?';
        params.push(competencia_id);
      }

      if (search) {
        whereClause += ' AND (u.nombre LIKE ? OR u.apellido LIKE ? OR u.email LIKE ?)';
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
      }

      // Query principal (sin COUNT(*) OVER() para evitar problemas)
      const query = `
        SELECT 
          tp.*,
          u.email, u.nombre, u.apellido, u.telefono, u.estado, u.email_verificado
        FROM vf_tecnicos_perfiles tp
        INNER JOIN vf_usuarios u ON tp.usuario_id = u.id
        ${joinClause}
        ${whereClause}
        ORDER BY u.nombre, u.apellido
        LIMIT ? OFFSET ?
      `;

      // Query para contar total
      const countQuery = `
        SELECT COUNT(*) as total
        FROM vf_tecnicos_perfiles tp
        INNER JOIN vf_usuarios u ON tp.usuario_id = u.id
        ${joinClause}
        ${whereClause}
      `;

      // Ejecutar consultas con paginación
      const rows = await database.query(query, [...params, parseInt(limit), parseInt(offset)]);
      const countRows = await database.query(countQuery, params);

      const tecnicos = rows.map(row => {
        const tecnico = new Tecnico(row);
        tecnico.nombre_completo = `${tecnico.nombre} ${tecnico.apellido}`;
        return tecnico;
      });

      const totalCount = countRows.length > 0 ? countRows[0].total : 0;

      return {
        tecnicos,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(totalCount),
          pages: Math.ceil(totalCount / limit)
        }
      };

    } catch (error) {
      logger.error('Error listando técnicos:', error);
      throw error;
    }
  }

  // Actualizar técnico
  static async update(id, updateData) {
    try {
      const tecnico = await this.findById(id);
      if (!tecnico) {
        throw new Error('Técnico no encontrado');
      }

      const allowedFields = [
        'numero_identificacion', 'fecha_nacimiento', 'direccion', 'ciudad', 'pais',
        'experiencia_anos', 'nivel_experiencia', 'disponibilidad', 'tarifa_por_hora',
        'moneda', 'biografia', 'foto_perfil'
      ];

      const setClause = [];
      const params = [];

      allowedFields.forEach(field => {
        if (Object.prototype.hasOwnProperty.call(updateData, field)) {
          setClause.push(`${field} = ?`);
          params.push(updateData[field]);
        }
      });

      if (setClause.length === 0) {
        throw new Error('No hay campos válidos para actualizar');
      }

      params.push(id);

      await database.query(`
        UPDATE vf_tecnicos_perfiles 
        SET ${setClause.join(', ')}, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = ?
      `, params);

      logger.info(`Técnico actualizado: ID ${id}`);
      return await this.findById(id);

    } catch (error) {
      logger.error('Error actualizando técnico:', error);
      throw error;
    }
  }

  // Cambiar estado del usuario técnico
  static async changeStatus(id, estado) {
    try {
      const tecnico = await this.findById(id);
      if (!tecnico) {
        throw new Error('Técnico no encontrado');
      }

      await database.query(`
        UPDATE vf_usuarios 
        SET estado = ?, fecha_actualizacion = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [estado, tecnico.usuario_id]);

      logger.info(`Estado del técnico cambiado: ID ${id} -> ${estado}`);
      return await this.findById(id);

    } catch (error) {
      logger.error('Error cambiando estado del técnico:', error);
      throw error;
    }
  }

  // Obtener competencias del técnico
  async getCompetencias() {
    try {
      const [rows] = await database.query(`
        SELECT 
          tc.*,
          cc.nombre, cc.descripcion, cc.categoria, cc.nivel_requerido,
          cc.certificacion_requerida
        FROM vf_tecnicos_competencias tc
        INNER JOIN vf_competencias_catalogo cc ON tc.competencia_id = cc.id
        WHERE tc.tecnico_id = ?
        ORDER BY cc.categoria, cc.nombre
      `, [this.id]);

      return rows;
    } catch (error) {
      logger.error('Error obteniendo competencias del técnico:', error);
      throw error;
    }
  }

  // Agregar competencia al técnico
  async addCompetencia(competencia_id, nivel_actual = 'basico', certificado = false) {
    try {
      const result = await database.query(`
        INSERT INTO vf_tecnicos_competencias (tecnico_id, competencia_id, nivel_actual, certificado)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          nivel_actual = VALUES(nivel_actual),
          certificado = VALUES(certificado),
          fecha_creacion = CURRENT_TIMESTAMP
      `, [this.id, competencia_id, nivel_actual, certificado]);

      logger.info(`Competencia agregada al técnico: ${this.id} -> ${competencia_id}`);
      return result;

    } catch (error) {
      logger.error('Error agregando competencia al técnico:', error);
      throw error;
    }
  }

  // Obtener documentos del técnico
  async getDocumentos() {
    try {
      const result = await database.query(`
        SELECT *
        FROM vf_tecnicos_documentos
        WHERE tecnico_id = ?
        ORDER BY fecha_subida DESC
      `, [this.id]);

      return rows;
    } catch (error) {
      logger.error('Error obteniendo documentos del técnico:', error);
      throw error;
    }
  }

  // Estadísticas de técnicos
  static async getStats() {
    try {
      const result = await database.query(`
        SELECT 
          tp.disponibilidad,
          tp.nivel_experiencia,
          u.estado,
          COUNT(*) as total
        FROM vf_tecnicos_perfiles tp
        INNER JOIN vf_usuarios u ON tp.usuario_id = u.id
        GROUP BY tp.disponibilidad, tp.nivel_experiencia, u.estado
        ORDER BY tp.disponibilidad, tp.nivel_experiencia
      `);

      const stats = Array.isArray(result) ? result : [result];
      return stats;
    } catch (error) {
      logger.error('Error obteniendo estadísticas de técnicos:', error);
      throw error;
    }
  }

  // Técnicos disponibles para asignación
  static async getAvailable(competencias_requeridas = []) {
    try {
      let competenciaFilter = '';
      const params = [];

      if (competencias_requeridas.length > 0) {
        const placeholders = competencias_requeridas.map(() => '?').join(',');
        competenciaFilter = `
          AND tp.id IN (
            SELECT tc.tecnico_id 
            FROM vf_tecnicos_competencias tc 
            WHERE tc.competencia_id IN (${placeholders})
            GROUP BY tc.tecnico_id
            HAVING COUNT(DISTINCT tc.competencia_id) = ?
          )
        `;
        params.push(...competencias_requeridas, competencias_requeridas.length);
      }

      const result = await database.query(`
        SELECT 
          tp.*,
          u.email, u.nombre, u.apellido, u.telefono, u.estado
        FROM vf_tecnicos_perfiles tp
        INNER JOIN vf_usuarios u ON tp.usuario_id = u.id
        WHERE tp.disponibilidad = 'disponible' 
          AND u.estado = 'activo'
          ${competenciaFilter}
        ORDER BY tp.experiencia_anos DESC, u.nombre
      `, params);

      return rows.map(row => {
        const tecnico = new Tecnico(row);
        tecnico.nombre_completo = `${tecnico.nombre} ${tecnico.apellido}`;
        return tecnico;
      });

    } catch (error) {
      logger.error('Error obteniendo técnicos disponibles:', error);
      throw error;
    }
  }
}

module.exports = Tecnico;