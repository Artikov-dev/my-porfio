"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const database_1 = require("../config/database");
const error_middleware_1 = require("../middlewares/error.middleware");
const redis_1 = __importDefault(require("../config/redis"));
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
exports.ProjectService = {
    async getAllProjects() {
        // Try cache first
        try {
            const cached = await redis_1.default.get('projects');
            if (cached)
                return JSON.parse(cached);
        }
        catch (e) {
            // Ignore cache errors
        }
        // No built-in fallback list here: the frontend already shows its own when this returns
        // an empty list or fails, and a DB outage should surface as an error, not as fake data.
        const result = await database_1.db.query('SELECT * FROM projects ORDER BY created_at DESC');
        if (result.rows.length > 0) {
            await redis_1.default.set('projects', JSON.stringify(result.rows), 'EX', 3600);
        }
        return result.rows;
    },
    async getProjectById(id) {
        if (!UUID_PATTERN.test(id))
            throw new error_middleware_1.CustomError('Project not found', 404);
        // Views are counted only by POST /projects/:id/view (rate-limited per IP); counting here too doubled them
        const result = await database_1.db.query('SELECT * FROM projects WHERE id = $1', [id]);
        if (result.rows.length === 0)
            throw new error_middleware_1.CustomError('Project not found', 404);
        return result.rows[0];
    },
    async incrementViews(id) {
        // Built-in fallback items ('proj-0') aren't DB rows; a non-UUID id would make Postgres throw
        if (!UUID_PATTERN.test(id))
            return false;
        const result = await database_1.db.query('UPDATE projects SET views = COALESCE(views, 0) + 1 WHERE id = $1', [id]);
        // The cached list carries view counts; drop it so the admin dashboard isn't an hour behind
        await redis_1.default.del('projects');
        return (result.rowCount ?? 0) > 0;
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
        if (!UUID_PATTERN.test(id))
            throw new error_middleware_1.CustomError('Project not found', 404);
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
        if (!UUID_PATTERN.test(id))
            throw new error_middleware_1.CustomError('Project not found', 404);
        const result = await database_1.db.query('DELETE FROM projects WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            throw new error_middleware_1.CustomError('Project not found', 404);
        }
        // Invalidate cache
        await redis_1.default.del('projects');
        return true;
    },
};
