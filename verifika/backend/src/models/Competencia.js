// Competencia.js - Modelo para gestión del catálogo de competencias
const database = require('../config/database');
const logger = require('../config/logger');

class Competencia {
  constructor(data = {}) {
    this.id = data.id;
    this.nombre = data.nombre;
    this.descripcion = data.descripcion;
    this.categoria = data.categoria;
    this.nivel_requerido = data.nivel_requerido || 'basico';
    this.certificacion_requerida = data.certificacion_requerida || false;
    this.activo = data.activo !== undefined ? data.activo : true;
    this.fecha_creacion = data.fecha_creacion;
  }

  // Crear nueva competencia
  static async create(competenciaData) {
    try {
      const result = await database.query(`
        INSERT INTO vf_competencias_catalogo (
          nombre, descripcion, categoria, nivel_requerido, certificacion_requerida, activo
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        competenciaData.nombre,
        competenciaData.descripcion || null,
        competenciaData.categoria || null,
        competenciaData.nivel_requerido || 'basico',
        competenciaData.certificacion_requerida || false,
        competenciaData.activo !== undefined ? competenciaData.activo : true
      ]);

      // Manejar tanto array como objeto de respuesta
      const insertId = Array.isArray(result) ? result[0].insertId : result.insertId;

      const competencia = await this.findById(insertId);
      logger.info(`Competencia creada: ${competencia.nombre}`);
      
      return competencia;

    } catch (error) {
      logger.error('Error creando competencia:', error);
      throw error;
    }
  }

  // Buscar competencia por ID
  static async findById(id) {
    try {
      const result = await database.query(`
        SELECT * FROM vf_competencias_catalogo WHERE id = ?
      `, [id]);

      const rows = Array.isArray(result) ? result : [result];
      if (!rows || rows.length === 0) return null;
      return new Competencia(rows[0]);

    } catch (error) {
      logger.error('Error buscando competencia por ID:', error);
      throw error;
    }
  }

  // Buscar competencia por nombre
  static async findByName(nombre) {
    try {
      const result = await database.query(`
        SELECT * FROM vf_competencias_catalogo WHERE nombre = ?
      `, [nombre]);

      const rows = Array.isArray(result) ? result : [result];
      if (!rows || rows.length === 0) return null;
      return new Competencia(rows[0]);

    } catch (error) {
      logger.error('Error buscando competencia por nombre:', error);
      throw error;
    }
  }

  // Listar competencias con filtros y paginación
  static async findAll(options = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        categoria,
        nivel_requerido,
        certificacion_requerida,
        activo = true,
        search
      } = options;

      const offset = (page - 1) * limit;
      let whereClause = 'WHERE 1=1';
      const params = [];

      // Filtros
      if (categoria) {
        whereClause += ' AND categoria = ?';
        params.push(categoria);
      }

      if (nivel_requerido) {
        whereClause += ' AND nivel_requerido = ?';
        params.push(nivel_requerido);
      }

      if (certificacion_requerida !== undefined) {
        whereClause += ' AND certificacion_requerida = ?';
        params.push(certificacion_requerida);
      }

      if (activo !== undefined) {
        whereClause += ' AND activo = ?';
        params.push(activo);
      }

      if (search) {
        whereClause += ' AND (nombre LIKE ? OR descripcion LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      // Query principal
      const query = `
        SELECT *, COUNT(*) OVER() as total_count
        FROM vf_competencias_catalogo
        ${whereClause}
        ORDER BY categoria, nombre
        LIMIT ? OFFSET ?
      `;

      params.push(parseInt(limit), parseInt(offset));
      const result = await database.query(query, params);
      const rows = Array.isArray(result) ? result : [result];

      const competencias = rows.map(row => new Competencia(row));
      const totalCount = rows.length > 0 ? rows[0].total_count : 0;

      return {
        competencias,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(totalCount),
          pages: Math.ceil(totalCount / limit)
        }
      };

    } catch (error) {
      logger.error('Error listando competencias:', error);
      throw error;
    }
  }

  // Actualizar competencia
  static async update(id, updateData) {
    try {
      const competencia = await this.findById(id);
      if (!competencia) {
        throw new Error('Competencia no encontrada');
      }

      const allowedFields = [
        'nombre', 'descripcion', 'categoria', 'nivel_requerido', 
        'certificacion_requerida', 'activo'
      ];

      const setClause = [];
      const params = [];

      allowedFields.forEach(field => {
        if (updateData.hasOwnProperty(field)) {
          setClause.push(`${field} = ?`);
          params.push(updateData[field]);
        }
      });

      if (setClause.length === 0) {
        throw new Error('No hay campos válidos para actualizar');
      }

      params.push(id);

      await database.query(`
        UPDATE vf_competencias_catalogo 
        SET ${setClause.join(', ')}
        WHERE id = ?
      `, params);

      logger.info(`Competencia actualizada: ID ${id}`);
      return await this.findById(id);

    } catch (error) {
      logger.error('Error actualizando competencia:', error);
      throw error;
    }
  }

  // Desactivar competencia (soft delete)
  static async deactivate(id) {
    try {
      const competencia = await this.findById(id);
      if (!competencia) {
        throw new Error('Competencia no encontrada');
      }

      await database.query(`
        UPDATE vf_competencias_catalogo 
        SET activo = FALSE
        WHERE id = ?
      `, [id]);

      logger.info(`Competencia desactivada: ID ${id}`);
      return await this.findById(id);

    } catch (error) {
      logger.error('Error desactivando competencia:', error);
      throw error;
    }
  }

  // Obtener categorías disponibles
  static async getCategories() {
    try {
      const result = await database.query(`
        SELECT DISTINCT categoria
        FROM vf_competencias_catalogo
        WHERE categoria IS NOT NULL AND activo = TRUE
        ORDER BY categoria
      `);

      const rows = Array.isArray(result) ? result : [result];
      return rows.map(row => row.categoria);

    } catch (error) {
      logger.error('Error obteniendo categorías:', error);
      throw error;
    }
  }

  // Obtener técnicos que tienen esta competencia
  async getTecnicos() {
    try {
      const result = await database.query(`
        SELECT 
          tc.*,
          tp.id as tecnico_id,
          u.nombre, u.apellido, u.email
        FROM vf_tecnicos_competencias tc
        INNER JOIN vf_tecnicos_perfiles tp ON tc.tecnico_id = tp.id
        INNER JOIN vf_usuarios u ON tp.usuario_id = u.id
        WHERE tc.competencia_id = ?
        ORDER BY u.nombre, u.apellido
      `, [this.id]);

      const rows = Array.isArray(result) ? result : [result];
      return rows;

    } catch (error) {
      logger.error('Error obteniendo técnicos con competencia:', error);
      throw error;
    }
  }

  // Estadísticas de competencias
  static async getStats() {
    try {
      const result = await database.query(`
        SELECT 
          cc.categoria,
          cc.nivel_requerido,
          COUNT(cc.id) as total_competencias,
          COUNT(tc.id) as tecnicos_asignados,
          SUM(CASE WHEN tc.certificado = TRUE THEN 1 ELSE 0 END) as certificados
        FROM vf_competencias_catalogo cc
        LEFT JOIN vf_tecnicos_competencias tc ON cc.id = tc.competencia_id
        WHERE cc.activo = TRUE
        GROUP BY cc.categoria, cc.nivel_requerido
        ORDER BY cc.categoria, cc.nivel_requerido
      `);

      const stats = Array.isArray(result) ? result : [result];
      return stats;

    } catch (error) {
      logger.error('Error obteniendo estadísticas de competencias:', error);
      throw error;
    }
  }

  // Competencias más demandadas
  static async getMostDemanded(limit = 10) {
    try {
      const result = await database.query(`
        SELECT 
          cc.*,
          COUNT(tc.id) as total_tecnicos,
          COUNT(CASE WHEN tc.certificado = TRUE THEN 1 END) as tecnicos_certificados
        FROM vf_competencias_catalogo cc
        LEFT JOIN vf_tecnicos_competencias tc ON cc.id = tc.competencia_id
        WHERE cc.activo = TRUE
        GROUP BY cc.id
        ORDER BY total_tecnicos DESC, tecnicos_certificados DESC
        LIMIT ?
      `, [limit]);

      const rows = Array.isArray(result) ? result : [result];
      return rows.map(row => new Competencia(row));

    } catch (error) {
      logger.error('Error obteniendo competencias más demandadas:', error);
      throw error;
    }
  }

  // Verificar si se puede eliminar la competencia
  async canDelete() {
    try {
      const result = await database.query(`
        SELECT COUNT(*) as count
        FROM vf_tecnicos_competencias
        WHERE competencia_id = ?
      `, [this.id]);

      const rows = Array.isArray(result) ? result : [result];
      return rows[0].count === 0;

    } catch (error) {
      logger.error('Error verificando si se puede eliminar competencia:', error);
      throw error;
    }
  }

  // Eliminar competencia (hard delete)
  static async delete(id) {
    try {
      const competencia = await this.findById(id);
      if (!competencia) {
        throw new Error('Competencia no encontrada');
      }

      // Verificar si se puede eliminar
      const canDelete = await competencia.canDelete();
      if (!canDelete) {
        throw new Error('No se puede eliminar la competencia porque tiene técnicos asignados');
      }

      await database.query(`
        DELETE FROM vf_competencias_catalogo WHERE id = ?
      `, [id]);

      logger.info(`Competencia eliminada: ID ${id}`);
      return true;

    } catch (error) {
      logger.error('Error eliminando competencia:', error);
      throw error;
    }
  }
}

module.exports = Competencia;