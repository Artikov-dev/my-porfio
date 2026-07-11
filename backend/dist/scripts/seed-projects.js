"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
});
const seedProjects = async () => {
    try {
        const client = await pool.connect();
        console.log('✅ Connected. Clearing existing projects...');
        await client.query('DELETE FROM projects'); // clear old ones
        const projects = [
            {
                title: {
                    en: 'Wedding Platform',
                    uz: "To'y Platformasi",
                    ru: 'Свадебная Платформа',
                },
                description: {
                    en: 'A platform to organize and manage weddings with ease.',
                    uz: "To'ylarni osongina tashkil etish va boshqarish uchun platforma.",
                    ru: 'Платформа для легкой организации и управления свадьбами.',
                },
                image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop',
                github_url: 'https://github.com/Artikov-dev/Wedding-Platforom',
                live_url: 'https://wedding-platforom.vercel.app',
                tech_stack: ['React', 'Node.js', 'Tailwind CSS'],
            },
            {
                title: {
                    en: 'Clinic Management System',
                    uz: 'Klinikani Boshqarish Tizimi',
                    ru: 'Система Управления Клиникой',
                },
                description: {
                    en: 'A modern frontend application for managing clinic operations, patients, and appointments.',
                    uz: 'Klinika faoliyati, bemorlar va qabullarni boshqarish uchun zamonaviy frontend ilovasi.',
                    ru: 'Современное frontend приложение для управления операциями клиники, пациентами и приемами.',
                },
                image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
                github_url: 'https://github.com/Artikov-dev/clinic-frontend',
                live_url: 'https://clinic-frontend-roan.vercel.app',
                tech_stack: ['React', 'TypeScript', 'Tailwind CSS'],
            },
            {
                title: {
                    en: 'Fashion E-Commerce',
                    uz: "Moda Onlayn Do'koni",
                    ru: 'Модный Интернет-магазин',
                },
                description: {
                    en: 'An online fashion store with a stylish interface and seamless shopping experience.',
                    uz: "Zamonaviy interfeys va qulay xarid tajribasiga ega onlayn moda do'koni.",
                    ru: 'Онлайн-магазин модной одежды со стильным интерфейсом и удобным процессом покупок.',
                },
                image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
                github_url: 'https://github.com/Artikov-dev/Fashion',
                live_url: 'https://github.com/Artikov-dev/Fashion',
                tech_stack: ['React', 'CSS', 'JavaScript'],
            },
        ];
        console.log('Inserting projects...');
        for (const p of projects) {
            // Assuming 'content' doesn't exist, remove it from the query
            await client.query(`
        INSERT INTO projects (title, description, image_url, github_url, live_url, tech_stack)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [
                p.title,
                p.description,
                p.image_url,
                p.github_url,
                p.live_url,
                p.tech_stack,
            ]);
        }
        client.release();
        console.log('🎉 3 Projects successfully seeded!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
};
seedProjects();
