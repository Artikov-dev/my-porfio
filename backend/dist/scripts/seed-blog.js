"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../config/database");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const seedBlog = async () => {
    try {
        console.log('Seeding blogs...');
        await database_1.db.query('DELETE FROM blogs');
        const blogs = [
            {
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
            },
            {
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
            },
        ];
        for (const b of blogs) {
            await database_1.db.query(`
        INSERT INTO blogs (title, content, image_url, tags, reading_time)
        VALUES ($1, $2, $3, $4, $5)
      `, [b.title, b.content, b.image_url, b.tags, b.reading_time]);
        }
        console.log('🎉 2 Blogs successfully seeded!');
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding blogs:', error);
        process.exit(1);
    }
};
seedBlog();
