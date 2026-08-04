export interface ProjectItem {
  id: string;
  title: Record<string, string>;
  description: Record<string, string>;
  content?: Record<string, string>;
  image_url: string;
  github_url?: string;
  live_url?: string;
  tech_stack: string[];
}

export const DEFAULT_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-0',
    title: {
      en: 'ControlLife - Task & Life Management System',
      uz: 'ControlLife - Topshiriqlar va Hayotni Boshqarish Tizimi',
      ru: 'ControlLife - Система Управления Задачами и Жизнью',
    },
    description: {
      en: 'An all-in-one productivity and personal management dashboard designed to track tasks, goals, habits, and daily workflow efficiently.',
      uz: "Vazifalar, maqsadlar, odatlar va kunlik ish jarayonini samarali kuzatish uchun mo'ljallangan barchasi birda unumdorlik platformasi.",
      ru: 'Многофункциональная платформа продуктивности для эффективного отслеживания задач, целей, привычек и ежедневного рабочего процесса.',
    },
    image_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=2072&auto=format&fit=crop',
    github_url: 'https://github.com/Artikov-dev',
    live_url: 'https://controllife.artikov.dev/auth/login',
    tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL'],
  },
  {
    id: 'proj-1',
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
    id: 'proj-2',
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
    id: 'proj-3',
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
