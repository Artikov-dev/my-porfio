import { db } from '../config/database';

export interface SEOSettings {
  title: { en: string; uz: string; ru: string };
  description: { en: string; uz: string; ru: string };
  keywords: string[];
  og_image: string;
}

export class SEOService {
  static async getSettings() {
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
      // Seed default settings
      const defaultSettings = {
        title: {
          en: 'Roma Artikov | Portfolio',
          uz: 'Roma Artikov | Portfoli',
          ru: 'Рома Артиков | Портфолио',
        },
        description: {
          en: 'Full Stack Engineer based in Uzbekistan',
          uz: "O'zbekistondagi Full Stack Muhandis",
          ru: 'Full Stack Инженер из Узбекистана',
        },
        keywords: [
          'Roma Artikov',
          'Full Stack',
          'Developer',
          'Uzbekistan',
          'React',
          'Node.js',
        ],
        og_image:
          'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200',
      };

      result = await db.query(
        `
        INSERT INTO seo_settings (id, title, description, keywords, og_image)
        VALUES (1, $1, $2, $3, $4)
        RETURNING *;
      `,
        [
          defaultSettings.title,
          defaultSettings.description,
          defaultSettings.keywords,
          defaultSettings.og_image,
        ],
      );
    }

    return result.rows[0];
  }

  static async updateSettings(data: SEOSettings) {
    const result = await db.query(
      `
      UPDATE seo_settings 
      SET title = $1, description = $2, keywords = $3, og_image = $4, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
      RETURNING *;
    `,
      [data.title, data.description, data.keywords, data.og_image],
    );

    return result.rows[0];
  }
}
