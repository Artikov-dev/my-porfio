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

export const ProjectService = {
  async getAllProjects() {
    // Try cache first
    const cached = await redisClient.get('projects');
    if (cached) return JSON.parse(cached);

    const result = await db.query(
      'SELECT * FROM projects ORDER BY created_at DESC',
    );

    // Set cache
    await redisClient.set('projects', JSON.stringify(result.rows), 'EX', 3600); // 1 hour cache
    return result.rows;
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
