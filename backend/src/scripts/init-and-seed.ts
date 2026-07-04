import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const initAndSeed = async () => {
  try {
    const client = await pool.connect();
    console.log('⏳ Connecting to Render PostgreSQL database...');
    
    // Drop existing tables that might conflict
    await client.query('DROP TABLE IF EXISTS projects CASCADE');
    await client.query('DROP TABLE IF EXISTS blogs CASCADE');
    await client.query('DROP TABLE IF EXISTS contacts CASCADE');
    await client.query('DROP TABLE IF EXISTS chat_messages CASCADE');
    console.log('✅ Dropped old tables.');

    // Projects Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title JSONB NOT NULL,
        description JSONB NOT NULL,
        content JSONB NOT NULL,
        image_url TEXT NOT NULL,
        github_url TEXT,
        live_url TEXT,
        tech_stack TEXT[] NOT NULL DEFAULT '{}',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Projects table created.');

    // Blogs Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title JSONB NOT NULL,
        content JSONB NOT NULL,
        image_url TEXT NOT NULL,
        tags TEXT[] NOT NULL DEFAULT '{}',
        reading_time INTEGER DEFAULT 1,
        views INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Blogs table created.');

    // Contacts Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        body TEXT NOT NULL,
        location TEXT,
        ip_address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Contacts table created.');

    // Chat Messages Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS chat_messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        session_id TEXT NOT NULL,
        name TEXT NOT NULL,
        text TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT false,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Chat Messages table created.');

    const projects = [
      {
        title: { en: 'Wedding Platform', uz: 'To\'y Platformasi', ru: 'Свадебная Платформа' },
        description: { en: 'A platform to organize and manage weddings with ease.', uz: 'To\'ylarni osongina tashkil etish va boshqarish uchun platforma.', ru: 'Платформа для легкой организации и управления свадьбами.' },
        content: { en: 'Full features list...', uz: 'To\'liq imkoniyatlar ro\'yxati...', ru: 'Полный список возможностей...' },
        image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop',
        github_url: 'https://github.com/Artikov-dev/Wedding-Platforom',
        live_url: 'https://wedding-platforom.vercel.app',
        tech_stack: ['React', 'Node.js', 'Tailwind CSS']
      },
      {
        title: { en: 'Clinic Management System', uz: 'Klinikani Boshqarish Tizimi', ru: 'Система Управления Клиникой' },
        description: { en: 'A modern frontend application for managing clinic operations, patients, and appointments.', uz: 'Klinika faoliyati, bemorlar va qabullarni boshqarish uchun zamonaviy frontend ilovasi.', ru: 'Современное frontend приложение для управления операциями клиники, пациентами и приемами.' },
        content: { en: 'Full features list...', uz: 'To\'liq imkoniyatlar ro\'yxati...', ru: 'Полный список возможностей...' },
        image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
        github_url: 'https://github.com/Artikov-dev/clinic-frontend',
        live_url: 'https://clinic-frontend-roan.vercel.app',
        tech_stack: ['React', 'TypeScript', 'Tailwind CSS']
      },
      {
        title: { en: 'Fashion E-Commerce', uz: 'Moda Onlayn Do\'koni', ru: 'Модный Интернет-магазин' },
        description: { en: 'An online fashion store with a stylish interface and seamless shopping experience.', uz: 'Zamonaviy interfeys va qulay xarid tajribasiga ega onlayn moda do\'koni.', ru: 'Онлайн-магазин модной одежды со стильным интерфейсом и удобным процессом покупок.' },
        content: { en: 'Full features list...', uz: 'To\'liq imkoniyatlar ro\'yxati...', ru: 'Полный список возможностей...' },
        image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
        github_url: 'https://github.com/Artikov-dev/Fashion',
        live_url: 'https://github.com/Artikov-dev/Fashion',
        tech_stack: ['React', 'CSS', 'JavaScript']
      }
    ];

    console.log('Inserting projects...');
    for (const p of projects) {
      await client.query(`
        INSERT INTO projects (title, description, content, image_url, github_url, live_url, tech_stack)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [p.title, p.description, p.content, p.image_url, p.github_url, p.live_url, p.tech_stack]);
    }

    client.release();
    console.log('🎉 3 Projects successfully seeded!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing database:', error);
    process.exit(1);
  }
};

initAndSeed();
