"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const database_1 = require("../config/database");
const error_middleware_1 = require("../middlewares/error.middleware");
const redis_1 = __importDefault(require("../config/redis"));
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
exports.BlogService = {
    async getAllBlogs() {
        try {
            const cached = await redis_1.default.get('blogs');
            if (cached)
                return JSON.parse(cached);
        }
        catch (e) { }
        // No built-in fallback posts here: the frontend shows its own when this is empty or fails
        const result = await database_1.db.query('SELECT * FROM blogs ORDER BY created_at DESC');
        if (result.rows.length > 0) {
            await redis_1.default.set('blogs', JSON.stringify(result.rows), 'EX', 3600);
        }
        return result.rows;
    },
    async getBlogById(id) {
        if (!UUID_PATTERN.test(id))
            throw new error_middleware_1.CustomError('Blog not found', 404);
        // Views are counted only by POST /blogs/:id/view (rate-limited per IP); counting here too doubled them
        const result = await database_1.db.query('SELECT * FROM blogs WHERE id = $1', [id]);
        if (result.rows.length === 0)
            throw new error_middleware_1.CustomError('Blog not found', 404);
        return result.rows[0];
    },
    async incrementViews(id) {
        // Built-in fallback posts ('blog-1') aren't DB rows; a non-UUID id would make Postgres throw
        if (!UUID_PATTERN.test(id))
            return false;
        const result = await database_1.db.query('UPDATE blogs SET views = COALESCE(views, 0) + 1 WHERE id = $1', [id]);
        // The cached list carries view counts; drop it so they don't lag an hour behind
        await redis_1.default.del('blogs');
        return (result.rowCount ?? 0) > 0;
    },
    async createBlog(data) {
        const reading_time = Math.ceil((data.content?.en?.split(' ').length || 200) / 200);
        const query = `
      INSERT INTO blogs (title, content, image_url, tags, reading_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `;
        const values = [
            data.title,
            data.content,
            data.image_url,
            data.tags,
            reading_time,
        ];
        const result = await database_1.db.query(query, values);
        try {
            await redis_1.default.del('blogs');
        }
        catch (e) { }
        return result.rows[0];
    },
    async updateBlog(id, data) {
        if (!UUID_PATTERN.test(id))
            throw new error_middleware_1.CustomError('Blog not found', 404);
        const reading_time = Math.ceil((data.content?.en?.split(' ').length || 200) / 200);
        const result = await database_1.db.query(`UPDATE blogs
       SET title = $1, content = $2, image_url = $3, tags = $4, reading_time = $5
       WHERE id = $6
       RETURNING *;`, [data.title, data.content, data.image_url, data.tags, reading_time, id]);
        if (result.rows.length === 0) {
            throw new error_middleware_1.CustomError('Blog not found', 404);
        }
        try {
            await redis_1.default.del('blogs');
        }
        catch (e) { }
        return result.rows[0];
    },
    async deleteBlog(id) {
        if (!UUID_PATTERN.test(id))
            throw new error_middleware_1.CustomError('Blog not found', 404);
        const result = await database_1.db.query('DELETE FROM blogs WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            throw new error_middleware_1.CustomError('Blog not found', 404);
        }
        try {
            await redis_1.default.del('blogs');
        }
        catch (e) { }
        return true;
    },
};
