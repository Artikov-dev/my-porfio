"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogService = void 0;
const database_1 = require("../config/database");
const error_middleware_1 = require("../middlewares/error.middleware");
const redis_1 = __importDefault(require("../config/redis"));
const DEFAULT_BACKEND_BLOGS = [
    {
        id: 'blog-1',
        title: {
            en: 'Building High Performance Modern Web Apps',
            uz: 'Yuqori Unumdorlikka Ega Zamonaviy Veb Ilovalar Yaratish',
            ru: 'Создание Высокопроизводительных Современных Веб-приложений',
        },
        content: {
            en: 'Exploring architectural concepts, state management, and real-time communication with Socket.io and React 19.',
            uz: 'Socket.io va React 19 yordamida meʼmoriy tushunchalar, holatni boshqarish va real vaqtdagi muloqotni oʻrganish.',
            ru: 'Изучение архитектурных концепций, управления состоянием и связью в реальном времени с Socket.io и React 19.',
        },
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
        tags: ['Architecture', 'React', 'Node.js'],
        reading_time: 5,
        views: 142,
        created_at: new Date().toISOString(),
    },
    {
        id: 'blog-2',
        title: {
            en: 'Mastering Real-time Communication with WebSockets',
            uz: 'WebSocket yordamida real vaqtdagi muloqotni mukammal oʻzlashtirish',
            ru: 'Освоение связи в реальном времени с помощью WebSockets',
        },
        content: {
            en: 'A deep dive into session persistence, bidirectional events, and scalable live chat architectures.',
            uz: 'Sessiyalarni saqlash, ikki tomonlama hodisalar va kengaytiriladigan jonli chat meʼmoriyatlariga chuqur shoʻngʻish.',
            ru: 'Глубокое погружение в сохранение сессий, двунаправленные события и масштабируемые архитектуры живого чата.',
        },
        image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
        tags: ['WebSockets', 'Socket.io', 'Node.js'],
        reading_time: 4,
        views: 98,
        created_at: new Date().toISOString(),
    },
];
exports.BlogService = {
    async getAllBlogs() {
        try {
            const cached = await redis_1.default.get('blogs');
            if (cached)
                return JSON.parse(cached);
        }
        catch (e) { }
        try {
            const result = await database_1.db.query('SELECT * FROM blogs ORDER BY created_at DESC');
            if (result.rows && result.rows.length > 0) {
                try {
                    await redis_1.default.set('blogs', JSON.stringify(result.rows), 'EX', 3600);
                }
                catch (e) { }
                return result.rows;
            }
            return DEFAULT_BACKEND_BLOGS;
        }
        catch (error) {
            console.warn('Database query failed for blogs, returning fallback:', error);
            return DEFAULT_BACKEND_BLOGS;
        }
    },
    async getBlogById(id) {
        try {
            const result = await database_1.db.query('SELECT * FROM blogs WHERE id = $1', [id]);
            if (result.rows.length > 0) {
                // Increment view counter asynchronously
                database_1.db.query('UPDATE blogs SET views = views + 1 WHERE id = $1', [id]).catch(() => { });
                return result.rows[0];
            }
        }
        catch (e) { }
        const fallback = DEFAULT_BACKEND_BLOGS.find((b) => b.id === id);
        if (fallback)
            return fallback;
        throw new error_middleware_1.CustomError('Blog not found', 404);
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
    async deleteBlog(id) {
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
