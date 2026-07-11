"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const database_1 = require("../config/database");
const error_middleware_1 = require("../middlewares/error.middleware");
const redis_1 = __importDefault(require("../config/redis"));
exports.ProjectService = {
    async getAllProjects() {
        // Try cache first
        const cached = await redis_1.default.get('projects');
        if (cached)
            return JSON.parse(cached);
        const result = await database_1.db.query('SELECT * FROM projects ORDER BY created_at DESC');
        // Set cache
        await redis_1.default.set('projects', JSON.stringify(result.rows), 'EX', 3600); // 1 hour cache
        return result.rows;
    },
    async getProjectById(id) {
        const result = await database_1.db.query('SELECT * FROM projects WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new error_middleware_1.CustomError('Project not found', 404);
        }
        return result.rows[0];
    },
    async createProject(data) {
        const query = `
      INSERT INTO projects (title, description, content, image_url, github_url, live_url, tech_stack)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
        const values = [
            data.title,
            data.description,
            data.content,
            data.image_url,
            data.github_url,
            data.live_url,
            data.tech_stack,
        ];
        const result = await database_1.db.query(query, values);
        // Invalidate cache
        await redis_1.default.del('projects');
        return result.rows[0];
    },
    async updateProject(id, data) {
        const query = `
      UPDATE projects 
      SET title = $1, description = $2, content = $3, image_url = $4, github_url = $5, live_url = $6, tech_stack = $7
      WHERE id = $8
      RETURNING *;
    `;
        const values = [
            data.title,
            data.description,
            data.content,
            data.image_url,
            data.github_url,
            data.live_url,
            data.tech_stack,
            id,
        ];
        const result = await database_1.db.query(query, values);
        if (result.rows.length === 0) {
            throw new error_middleware_1.CustomError('Project not found', 404);
        }
        await redis_1.default.del('projects');
        return result.rows[0];
    },
    async deleteProject(id) {
        const result = await database_1.db.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            throw new error_middleware_1.CustomError('Project not found', 404);
        }
        // Invalidate cache
        await redis_1.default.del('projects');
        return true;
    },
};
