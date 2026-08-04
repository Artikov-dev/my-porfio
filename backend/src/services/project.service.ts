import { db } from '../config/database';
import { CustomError } from '../middlewares/error.middleware';
import redisClient from '../config/redis';

export interface ProjectData {
  title: Record<string, string>; // JSONB { en: '', uz: '', ru: '' }
  description: Record<string, string>;
  content: Record<string, string>;
  image_url: string;
  github_url?: string;
  live_url?: string;
  tech_stack: string[];
}

const DEFAULT_BACKEND_PROJECTS = [
  {
    id: 'proj-0',
    title: { en: 'ControlLife - Task & Life Management System', uz: 'ControlLife - Topshiriqlar va Hayotni Boshqarish Tizimi', ru: 'ControlLife - Система Управления Задачами и Жизнью' },
    description: { en: 'An all-in-one productivity and personal management dashboard designed to track tasks, goals, habits, and daily workflow efficiently.', uz: "Vazifalar, maqsadlar, odatlar va kunlik ish jarayonini samarali kuzatish uchun mo'ljallangan barchasi birda unumdorlik platformasi.", ru: 'Многофункциональная платформа продуктивности для эффективного отслеживания задач, целей, привычек и ежедневного рабочего процесса.' },
    image_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop',
    github_url: 'https://github.com/Artikov-dev',
    live_url: 'https://controllife.artikov.dev/auth/login',
    tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL']
  },
  {
    id: 'proj-1',
    title: { en: 'Wedding Platform', uz: "To'y Platformasi", ru: 'Свадебная Платформа' },
    description: { en: 'A platform to organize and manage weddings with ease.', uz: "To'ylarni osongina tashkil etish va boshqarish uchun platforma.", ru: 'Платформа для легкой организации и управления свадьбами.' },
    image_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2069&auto=format&fit=crop',
    github_url: 'https://github.com/Artikov-dev/Wedding-Platforom',
    live_url: 'https://wedding-platforom.vercel.app',
    tech_stack: ['React', 'Node.js', 'Tailwind CSS']
  },
  {
    id: 'proj-2',
    title: { en: 'Clinic Management System', uz: 'Klinikani Boshqarish Tizimi', ru: 'Система Управления Клиникой' },
    description: { en: 'A modern frontend application for managing clinic operations, patients, and appointments.', uz: 'Klinika faoliyati, bemorlar va qabullarni boshqarish uchun zamonaviy frontend ilovasi.', ru: 'Современное frontend приложение для управления операциями клиники, пациентами и приемами.' },
    image_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop',
    github_url: 'https://github.com/Artikov-dev/clinic-frontend',
    live_url: 'https://clinic-frontend-roan.vercel.app',
    tech_stack: ['React', 'TypeScript', 'Tailwind CSS']
  },
  {
    id: 'proj-3',
    title: { en: 'Fashion E-Commerce', uz: "Moda Onlayn Do'koni", ru: 'Модный Интернет-магазин' },
    description: { en: 'An online fashion store with a stylish interface and seamless shopping experience.', uz: "Zamonaviy interfeys va qulay xarid tajribasiga ega onlayn moda do'koni.", ru: 'Онлайн-магазин модной одежды со стильным интерфейсом и удобным процессом покупок.' },
    image_url: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop',
    github_url: 'https://github.com/Artikov-dev/Fashion',
    live_url: 'https://github.com/Artikov-dev/Fashion',
    tech_stack: ['React', 'CSS', 'JavaScript']
  }
];

export const ProjectService = {
  async getAllProjects() {
    // Try cache first
    try {
      const cached = await redisClient.get('projects');
      if (cached) return JSON.parse(cached);
    } catch (e) {
      // Ignore cache errors
    }

    try {
      const result = await db.query(
        'SELECT * FROM projects ORDER BY created_at DESC',
      );

      if (result.rows && result.rows.length > 0) {
        try {
          await redisClient.set('projects', JSON.stringify(result.rows), 'EX', 3600);
        } catch (e) {}
        return result.rows;
      }
      return DEFAULT_BACKEND_PROJECTS;
    } catch (error) {
      console.error('Database query failed for projects, returning fallback:', error);
      return DEFAULT_BACKEND_PROJECTS;
    }
  },

  async getProjectById(id: string) {
    const result = await db.query('SELECT * FROM projects WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new CustomError('Project not found', 404);
    }
    // Increment views
    await db.query('UPDATE projects SET views = COALESCE(views, 0) + 1 WHERE id = $1', [id]);
    
    return result.rows[0];
  },

  async createProject(data: ProjectData) {
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

    const result = await db.query(query, values);

    // Invalidate cache
    await redisClient.del('projects');

    return result.rows[0];
  },

  async updateProject(id: string, data: ProjectData) {
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

    const result = await db.query(query, values);
    if (result.rows.length === 0) {
      throw new CustomError('Project not found', 404);
    }

    await redisClient.del('projects');
    return result.rows[0];
  },

  async deleteProject(id: string) {
    const result = await db.query(
      'DELETE FROM projects WHERE id = $1 RETURNING id',
      [id],
    );
    if (result.rows.length === 0) {
      throw new CustomError('Project not found', 404);
    }

    // Invalidate cache
    await redisClient.del('projects');
    return true;
  },
};
