export interface BlogItem {
  id: string;
  title: Record<string, string>;
  content: Record<string, string>;
  image_url: string;
  tags: string[];
  reading_time: number;
  views: number;
  created_at: string;
}

export const DEFAULT_BLOGS: BlogItem[] = [
  {
    id: 'blog-1',
    title: {
      en: 'Building High Performance Modern Web Apps',
      uz: 'Yuqori Unumdorlikka Ega Zamonaviy Veb Ilovalar Yaratish',
      ru: 'Создание Высокопроизводительных Современных Веб-приложений',
    },
    content: {
      en: 'Exploring architectural concepts, state management, and real-time communication with Socket.io and React 19.',
      uz: 'Socket.io va React 19 yordamida meʼmoriy tushunchalar, holatni boshqarish va real vaqtdagi muloqotni oʻrganish.',
      ru: 'Изучение архитектурных концепций, управления состоянием и связью в реальном времени с Socket.io и React 19.',
    },
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    tags: ['Architecture', 'React', 'Node.js'],
    reading_time: 5,
    views: 142,
    created_at: new Date().toISOString(),
  },
  {
    id: 'blog-2',
    title: {
      en: 'Mastering Real-time Communication with WebSockets',
      uz: 'WebSocket yordamida real vaqtdagi muloqotni mukammal oʻzlashtirish',
      ru: 'Освоение связи в реальном времени с помощью WebSockets',
    },
    content: {
      en: 'A deep dive into session persistence, bidirectional events, and scalable live chat architectures.',
      uz: 'Sessiyalarni saqlash, ikki tomonlama hodisalar va kengaytiriladigan jonli chat meʼmoriyatlariga chuqur shoʻngʻish.',
      ru: 'Глубокое погружение в сохранение сессий, двунаправленные события и масштабируемые архитектуры живого чата.',
    },
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
    tags: ['WebSockets', 'Socket.io', 'Node.js'],
    reading_time: 4,
    views: 98,
    created_at: new Date().toISOString(),
  },
];
