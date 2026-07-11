import { db } from '../config/database';
import { CustomError } from '../middlewares/error.middleware';
import redisClient from '../config/redis';

export interface BlogData {
  title: Record<string, string>; // JSONB
  content: Record<string, string>; // JSONB (Markdown text)
  image_url: string;
  tags: string[];
}

export const BlogService = {
  async getAllBlogs() {
    const cached = await redisClient.get('blogs');
    if (cached) return JSON.parse(cached);

    const result = await db.query(
      'SELECT * FROM blogs ORDER BY created_at DESC',
    );

    await redisClient.set('blogs', JSON.stringify(result.rows), 'EX', 3600);
    return result.rows;
  },

  async getBlogById(id: string) {
    const result = await db.query('SELECT * FROM blogs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      throw new CustomError('Blog not found', 404);
    }

    // Increment view counter
    await db.query('UPDATE blogs SET views = views + 1 WHERE id = $1', [id]);

    return result.rows[0];
  },

  async createBlog(data: BlogData) {
    const reading_time = Math.ceil(
      (data.content?.en?.split(' ').length || 200) / 200,
    ); // 200 words per min avg

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

    const result = await db.query(query, values);

    await redisClient.del('blogs');
    return result.rows[0];
  },

  async deleteBlog(id: string) {
    const result = await db.query(
      'DELETE FROM blogs WHERE id = $1 RETURNING id',
      [id],
    );
    if (result.rows.length === 0) {
      throw new CustomError('Blog not found', 404);
    }

    await redisClient.del('blogs');
    return true;
  },
};
