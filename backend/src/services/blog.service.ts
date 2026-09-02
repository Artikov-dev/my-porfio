import { db } from '../config/database';
import { CustomError } from '../middlewares/error.middleware';
import redisClient from '../config/redis';

export interface BlogData {
  title: Record<string, string>; // JSONB
  content: Record<string, string>; // JSONB (Markdown text)
  image_url: string;
  tags: string[];
}

const DEFAULT_BACKEND_BLOGS = [
  {
    id: 'blog-1',
    title: {
      en: 'Building High Performance Modern Web Apps with React 19 & TypeScript',
      uz: 'React 19 va TypeScript Yordamida Yuqori Unumdor Veb Ilovalar Yaratish',
      ru: 'Создание Высокопроизводительных Веб-приложений на React 19 и TypeScript',
    },
    content: {
      en: `### Introduction\n\nIn modern web development, speed and responsiveness are non-negotiable.\n\n### 1. Server Actions & React 19 Compiler\nReact 19 introduces automated memoization via the React Compiler.\n\n\`\`\`typescript\nconst [optimisticState, setOptimistic] = useOptimistic(currentState, (state, update) => ({ ...state, ...update }));\n\`\`\`\n\n### 2. Code Splitting\nLazy load non-critical routes with React.lazy().`,
      uz: `### Kirish\n\nZamonaviy veb-dasturlashda tezlik va optimal unumdorlik eng asosiy talablardan biridir.\n\n### 1. React 19 va Kompilyator Imkoniyatlari\nReact 19 da avtomatik memoizatsiya va optimistik holatlar taqdim etildi.\n\n\`\`\`typescript\nconst [optimisticState, setOptimistic] = useOptimistic(currentState, (state, update) => ({ ...state, ...update }));\n\`\`\`\n\n### 2. Kodni Bo'laklash\nMarshrutlarni React.lazy() yordamida yuklang.`,
      ru: `### Введение\n\nВ современной веб-разработке скорость и отзывчивость являются ключевыми факторами.\n\n### 1. Нововведения в React 19\nReact 19 упрощает работу с оптимистичными обновлениями.\n\n\`\`\`typescript\nconst [optimisticState, setOptimistic] = useOptimistic(currentState, (state, update) => ({ ...state, ...update }));\n\`\`\`\n\n### 2. Разделение кода\nИспользуйте React.lazy() для динамической загрузки.`,
    },
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    tags: ['Architecture', 'React 19', 'Performance', 'TypeScript'],
    reading_time: 4,
    views: 248,
    created_at: new Date().toISOString(),
  },
  {
    id: 'blog-2',
    title: {
      en: 'Mastering Real-time WebSockets with Node.js & Socket.io',
      uz: 'Node.js va Socket.io Yordamida Real-vaqtdagi WebSockets Texnologiyasini Mukammal O\'rganish',
      ru: 'Освоение Real-time WebSockets с помощью Node.js и Socket.io',
    },
    content: {
      en: `### Why WebSockets?\n\nTraditional HTTP polling creates massive network overhead. WebSockets establish a persistent, full-duplex TCP connection.\n\n\`\`\`javascript\nio.on('connection', (socket) => {\n  socket.join('room');\n});\n\`\`\`\n\n### 2. Resilience and Heartbeats\nImplement heartbeat pings to detect broken connections.`,
      uz: `### Nima Uchun WebSockets?\n\nAn'anaviy HTTP polling har safar yangi so'rov yuborib tarmoqni band qiladi. WebSocket esa doimiy aloqa kanalini ochadi.\n\n\`\`\`javascript\nio.on('connection', (socket) => {\n  socket.join('room');\n});\n\`\`\`\n\n### 2. Uzluksiz Ishlash\nPing/pong signallari orqali aloqani tekshiring.`,
      ru: `### Зачем нужны WebSockets?\n\nWebSockets устанавливают постоянное двунаправленное соединение между клиентом и сервером.\n\n\`\`\`javascript\nio.on('connection', (socket) => {\n  socket.join('room');\n});\n\`\`\`\n\n### 2. Отказоустойчивость\nПериодически проверяйте статус соединения.`,
    },
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
    tags: ['WebSockets', 'Socket.io', 'Node.js', 'Real-Time'],
    reading_time: 5,
    views: 189,
    created_at: new Date().toISOString(),
  },
];

export const BlogService = {
  async getAllBlogs() {
    try {
      const cached = await redisClient.get('blogs');
      if (cached) return JSON.parse(cached);
    } catch (e) {}

    try {
      const result = await db.query(
        'SELECT * FROM blogs ORDER BY created_at DESC',
      );

      if (result.rows && result.rows.length > 0) {
        try {
          await redisClient.set('blogs', JSON.stringify(result.rows), 'EX', 3600);
        } catch (e) {}
        return result.rows;
      }
      return DEFAULT_BACKEND_BLOGS;
    } catch (error) {
      console.warn('Database query failed for blogs, returning fallback:', error);
      return DEFAULT_BACKEND_BLOGS;
    }
  },

  async getBlogById(id: string) {
    try {
      const result = await db.query('SELECT * FROM blogs WHERE id = $1', [id]);
      if (result.rows.length > 0) {
        // Increment view counter asynchronously
        db.query('UPDATE blogs SET views = views + 1 WHERE id = $1', [id]).catch(() => {});
        return result.rows[0];
      }
    } catch (e) {}

    const fallback = DEFAULT_BACKEND_BLOGS.find((b) => b.id === id);
    if (fallback) return fallback;
    throw new CustomError('Blog not found', 404);
  },

  async createBlog(data: BlogData) {
    const reading_time = Math.ceil(
      (data.content?.en?.split(' ').length || 200) / 200,
    );

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
    try {
      await redisClient.del('blogs');
    } catch (e) {}
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

    try {
      await redisClient.del('blogs');
    } catch (e) {}
    return true;
  },
};

