import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'uz' | 'ru';

interface I18nContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // basic translation helper
}

const I18nContext = createContext<I18nContextProps | undefined>(undefined);

// Define basic static translations here if needed
const translations = {
  en: {
    home: 'Home',
    welcome: 'Welcome',
    projects: 'Projects',
    blog: 'Blog',
    about: 'About',
    skills: 'Skills',
    experience: 'Experience',
    contact: 'Contact',
    
    // Hero
    hero_title1: 'Engineering',
    hero_title2: 'Digital Experiences',
    hero_subtitle: 'I am Roma Artikov. A Senior Software Architect crafting enterprise-grade systems with precision and art.',
    explore_projects: 'Explore Projects',
    view_resume: 'View Resume',
    
    // About
    about_me: 'About Me',
    about_p1: 'I am Roma Artikov, a Full-Stack Engineer and Software Architect. I specialize in building high-performance, secure, and enterprise-grade web applications.',
    about_p2: 'My approach to software engineering is rooted in Clean Architecture, SOLID principles, and an obsessive focus on detail. I don\'t just write code; I engineer resilient digital experiences that scale elegantly.',
    about_p3: 'Currently, I am a student of the 24-B1-2 group, a proud GoldenMinds Grant Candidate, and continuously pushing the boundaries of modern web technologies.',
    
    // Skills
    tech_stack: 'Tech Stack',
    skills_title: 'Skills & Expertise',
    frontend_dev: 'Frontend Development',
    backend_eng: 'Backend Engineering',
    arch_devops: 'Architecture & DevOps',
    
    // Experience
    work_experience: 'Experience',
    exp1_role: 'Senior Software Architect',
    exp1_comp: 'Freelance / Open Source',
    exp1_desc: 'Architecting high-performance, secure web applications. Enforcing strict Clean Architecture patterns and integrating complex infrastructure.',
    exp2_role: 'Full-Stack Engineer',
    exp2_comp: 'Self-Taught & Independent',
    exp2_desc: 'Mastered the Node.js ecosystem, deeply studied database optimization, caching layers, and advanced React patterns.',
    
    // Contact
    get_in_touch: 'Get In Touch',
    contact_desc: 'Whether you have a question or want to discuss a complex architecture problem, my inbox is always open. Connect with me on your favorite platform!',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    send_message: 'Send Message',
    
    // Projects Preview
    featured_eng: 'Featured Engineering',
    featured_desc: 'Explore a collection of systems I\'ve architected. From complex dashboards to optimized REST APIs.',
    view_all_projects: 'View All Projects'
  },
  uz: {
    home: 'Asosiy',
    welcome: 'Xush kelibsiz',
    projects: 'Loyihalar',
    blog: 'Blog',
    about: 'Men Haqimda',
    skills: 'Ko\'nikmalar',
    experience: 'Tajriba',
    contact: 'Aloqa',
    
    // Hero
    hero_title1: 'Raqamli',
    hero_title2: 'Tizimlarni Yaratish',
    hero_subtitle: 'Men Roma Artikov. Korporativ darajadagi tizimlarni aniqlik va san\'at darajasida yaratuvchi dasturiy ta\'minot arxitektoriman.',
    explore_projects: 'Loyihalarni Ko\'rish',
    view_resume: 'Rezyumeni Ko\'rish',
    
    // About
    about_me: 'Men Haqimda',
    about_p1: 'Men Roma Artikov, Full-Stack dasturchi va Arxitektorman. Men yuqori samarali, xavfsiz va korporativ darajadagi veb-ilovalarni yaratishga ixtisoslashganman.',
    about_p2: 'Mening dasturlashga yondashuvim Clean Architecture, SOLID tamoyillari va mayda detallargacha bo\'lgan e\'tiborga asoslangan. Men shunchaki kod yozmayman; men nafis kengayadigan barqaror raqamli tizimlarni muhandislik darajasida yarataman.',
    about_p3: 'Hozirda men 24-B1-2 guruhi talabasi, GoldenMinds granti nomzodiman va zamonaviy veb-texnologiyalar chegaralarini doimiy ravishda kengaytirib boraman.',
    
    // Skills
    tech_stack: 'Texnologiyalar',
    skills_title: 'Ko\'nikmalar va Malaka',
    frontend_dev: 'Frontend Dasturlash',
    backend_eng: 'Backend Muhandisligi',
    arch_devops: 'Arxitektura va DevOps',
    
    // Experience
    work_experience: 'Tajriba',
    exp1_role: 'Katta Dasturiy Arxitektor',
    exp1_comp: 'Frilans / Open Source',
    exp1_desc: 'Yuqori samarali va xavfsiz veb-ilovalarni loyihalash. Qat\'iy Clean Architecture andozalarini qo\'llash va murakkab infratuzilmalarni integratsiya qilish.',
    exp2_role: 'Full-Stack Dasturchi',
    exp2_comp: 'Mustaqil o\'rganuvchi',
    exp2_desc: 'Node.js ekotizimini chuqur o\'zlashtirish, ma\'lumotlar bazasini optimallashtirish, kesh xotira qatlamlari va mukammal React naqshlarini o\'rganish.',
    
    // Contact
    get_in_touch: 'Bog\'lanish',
    contact_desc: 'Savollaringiz bo\'lsa yoki murakkab arxitektura muammosini muhokama qilmoqchi bo\'lsangiz, men doim ochiqman. O\'zingizga qulay platformada men bilan bog\'laning!',
    name: 'Ism',
    email: 'Elektron pochta',
    subject: 'Mavzu',
    message: 'Xabar',
    send_message: 'Xabarni Jo\'natish',
    
    // Projects Preview
    featured_eng: 'Tanlangan Loyihalar',
    featured_desc: 'Men arxitekturasini tuzgan tizimlar to\'plami bilan tanishing. Murakkab dashboardlardan tortib optimallashgan REST API largacha.',
    view_all_projects: 'Barcha Loyihalarni Ko\'rish'
  },
  ru: {
    home: 'Главная',
    welcome: 'Добро пожаловать',
    projects: 'Проекты',
    blog: 'Блог',
    about: 'Обо мне',
    skills: 'Навыки',
    experience: 'Опыт',
    contact: 'Контакты',
    
    // Hero
    hero_title1: 'Инженерия',
    hero_title2: 'Цифрового Опыта',
    hero_subtitle: 'Я Рома Артиков. Архитектор программного обеспечения, создающий корпоративные системы с высокой точностью.',
    explore_projects: 'Смотреть Проекты',
    view_resume: 'Смотреть Резюме',
    
    // About
    about_me: 'Обо мне',
    about_p1: 'Я Рома Артиков, Full-Stack разработчик и архитектор ПО. Я специализируюсь на создании высокопроизводительных, безопасных и корпоративных веб-приложений.',
    about_p2: 'Мой подход к разработке основан на Clean Architecture, принципах SOLID и пристальном внимании к деталям. Я не просто пишу код; я проектирую устойчивые цифровые системы, которые элегантно масштабируются.',
    about_p3: 'В настоящее время я студент группы 24-B1-2, кандидат на грант GoldenMinds, и постоянно расширяю границы современных веб-технологий.',
    
    // Skills
    tech_stack: 'Технологии',
    skills_title: 'Навыки и Экспертиза',
    frontend_dev: 'Frontend Разработка',
    backend_eng: 'Backend Инженерия',
    arch_devops: 'Архитектура и DevOps',
    
    // Experience
    work_experience: 'Опыт',
    exp1_role: 'Старший Архитектор ПО',
    exp1_comp: 'Фриланс / Open Source',
    exp1_desc: 'Проектирование высокопроизводительных и безопасных веб-приложений. Внедрение строгих паттернов Clean Architecture и интеграция сложной инфраструктуры.',
    exp2_role: 'Full-Stack Разработчик',
    exp2_comp: 'Самоучка & Независимый',
    exp2_desc: 'Освоил экосистему Node.js, глубоко изучил оптимизацию баз данных, слои кэширования и продвинутые паттерны React.',
    
    // Contact
    get_in_touch: 'Связаться',
    contact_desc: 'Если у вас есть вопрос или вы хотите обсудить сложную архитектурную задачу, я всегда открыт. Свяжитесь со мной на вашей любимой платформе!',
    name: 'Имя',
    email: 'Email',
    subject: 'Тема',
    message: 'Сообщение',
    send_message: 'Отправить',
    
    // Projects Preview
    featured_eng: 'Избранные Проекты',
    featured_desc: 'Ознакомьтесь с коллекцией систем, которые я спроектировал. От сложных панелей управления до оптимизированных REST API.',
    view_all_projects: 'Смотреть Все Проекты'
  }
};

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string) => {
    // @ts-ignore
    return translations[language][key] || key;
  };

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within an I18nProvider');
  return context;
};
