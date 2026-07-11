"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const database_1 = require("../config/database");
const error_middleware_1 = require("../middlewares/error.middleware");
const redis_1 = __importDefault(require("../config/redis"));
exports.BlogService = {
    async getAllBlogs() {
        const cached = await redis_1.default.get('blogs');
        if (cached)
            return JSON.parse(cached);
        const result = await database_1.db.query('SELECT * FROM blogs ORDER BY created_at DESC');
        await redis_1.default.set('blogs', JSON.stringify(result.rows), 'EX', 3600);
        return result.rows;
    },
    async getBlogById(id) {
        const result = await database_1.db.query('SELECT * FROM blogs WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            throw new error_middleware_1.CustomError('Blog not found', 404);
        }
        // Increment view counter
        await database_1.db.query('UPDATE blogs SET views = views + 1 WHERE id = $1', [id]);
        return result.rows[0];
    },
    async createBlog(data) {
        const reading_time = Math.ceil((data.content?.en?.split(' ').length || 200) / 200); // 200 words per min avg
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
        await redis_1.default.del('blogs');
        return result.rows[0];
    },
    async deleteBlog(id) {
        const result = await database_1.db.query('DELETE FROM blogs WHERE id = $1 RETURNING id', [id]);
        if (result.rows.length === 0) {
            throw new error_middleware_1.CustomError('Blog not found', 404);
        }
        await redis_1.default.del('blogs');
        return true;
    },
};
