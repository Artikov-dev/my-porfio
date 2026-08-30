import { db } from '../config/database';

export interface SEOSettings {
  title: { en: string; uz: string; ru: string };
  description: { en: string; uz: string; ru: string };
  keywords: string[];
  og_image: string;
}

const DEFAULT_SEO: SEOSettings = {
  title: {
    en: 'Roma Artikov | Full Stack Engineer & Creative Developer',
    uz: "Roma Artikov | Full Stack Muhandis va Dasturchi",
    ru: 'Рома Артиков | Full Stack Инженер и Разработчик',
  },
  description: {
    en: 'Full Stack Engineer crafting scalable web applications and intuitive digital experiences.',
    uz: "Masshtablanuvchi veb-ilovalar va qulay raqamli tizimlar yaratuvchi Full Stack dasturchi.",
    ru: 'Full Stack инженер, создающий масштабируемые веб-приложения и интерактивные цифровые решения.',
  },
  keywords: [
    'Roma Artikov',
    'Full Stack Engineer',
    'Software Engineer',
    'React',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'Uzbekistan',
  ],
  og_image:
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
};

export class SEOService {
  static async getSettings() {
    try {
      // Ensure table exists
      await db.query(`
        CREATE TABLE IF NOT EXISTS seo_settings (
          id INTEGER PRIMARY KEY DEFAULT 1,
          title JSONB NOT NULL,
          description JSONB NOT NULL,
          keywords TEXT[] NOT NULL DEFAULT '{}',
          og_image TEXT NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `);

      let result = await db.query('SELECT * FROM seo_settings WHERE id = 1');

      if (result.rows.length === 0) {
        result = await db.query(
          `
          INSERT INTO seo_settings (id, title, description, keywords, og_image)
          VALUES (1, $1, $2, $3, $4)
          RETURNING *;
        `,
          [
            DEFAULT_SEO.title,
            DEFAULT_SEO.description,
            DEFAULT_SEO.keywords,
            DEFAULT_SEO.og_image,
          ],
        );
      }

      return result.rows[0];
    } catch (err) {
      console.warn('SEO DB unavailable, returning default SEO settings:', err);
      return DEFAULT_SEO;
    }
  }

  static async updateSettings(data: SEOSettings) {
    try {
      const result = await db.query(
        `
        UPDATE seo_settings 
        SET title = $1, description = $2, keywords = $3, og_image = $4, updated_at = CURRENT_TIMESTAMP
        WHERE id = 1
        RETURNING *;
      `,
        [data.title, data.description, data.keywords, data.og_image],
      );

      return result.rows[0] || data;
    } catch (err) {
      return data;
    }
  }
}

