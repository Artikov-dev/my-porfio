"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SEOService = void 0;
const database_1 = require("../config/database");
const DEFAULT_SEO = {
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
    og_image: 'https://artikov.dev/og_banner.jpg',
};
let seoTableReady = false;
class SEOService {
    static async getSettings() {
        try {
            // Ensure table exists — once per process, not on every public page load
            if (!seoTableReady) {
                await database_1.db.query(`
          CREATE TABLE IF NOT EXISTS seo_settings (
            id INTEGER PRIMARY KEY DEFAULT 1,
            title JSONB NOT NULL,
            description JSONB NOT NULL,
            keywords TEXT[] NOT NULL DEFAULT '{}',
            og_image TEXT NOT NULL,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
          );
        `);
                seoTableReady = true;
            }
            let result = await database_1.db.query('SELECT * FROM seo_settings WHERE id = 1');
            if (result.rows.length === 0) {
                result = await database_1.db.query(`
          INSERT INTO seo_settings (id, title, description, keywords, og_image)
          VALUES (1, $1, $2, $3, $4)
          RETURNING *;
        `, [
                    DEFAULT_SEO.title,
                    DEFAULT_SEO.description,
                    DEFAULT_SEO.keywords,
                    DEFAULT_SEO.og_image,
                ]);
            }
            return result.rows[0];
        }
        catch (err) {
            console.warn('SEO DB unavailable, returning default SEO settings:', err);
            return DEFAULT_SEO;
        }
    }
    // Errors propagate so the admin sees "failed" instead of a fake "saved"
    static async updateSettings(data) {
        const result = await database_1.db.query(`
      INSERT INTO seo_settings (id, title, description, keywords, og_image)
      VALUES (1, $1, $2, $3, $4)
      ON CONFLICT (id) DO UPDATE
      SET title = EXCLUDED.title, description = EXCLUDED.description, keywords = EXCLUDED.keywords,
          og_image = EXCLUDED.og_image, updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `, [data.title, data.description, data.keywords, data.og_image]);
        return result.rows[0];
    }
}
exports.SEOService = SEOService;
