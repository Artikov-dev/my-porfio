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
        console.log('Inserting dummy blog...');
        const result = await database_1.db.query(`
      INSERT INTO blogs (title, content, image_url, tags, reading_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `, [
            {
                en: 'My First Blog Post',
                uz: 'Mening Birinchi Blogim',
                ru: 'Мой Первый Блог',
            },
            {
                en: 'This is the content of my first blog post. I am testing the new Admin Blog feature. It supports multi-language out of the box!',
                uz: "Bu mening birinchi blogimning mazmuni. Men yangi Admin Blog xususiyatini sinab ko'ryapman. U ko'p tillarni qo'llab-quvvatlaydi!",
                ru: 'Это содержание моего первого блога. Я тестирую новую функцию Admin Blog. Она поддерживает многоязычность из коробки!',
            },
            'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2000',
            ['Web', 'Development', 'React'],
            2,
        ]);
        console.log('Blog inserted:', result.rows[0].id);
        process.exit(0);
    }
    catch (error) {
        console.error('Error seeding blog:', error);
        process.exit(1);
    }
};
seedBlog();
