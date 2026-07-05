import { createContext, useContext, useState, ReactNode } from 'react';

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
    hero_title1: 'Full Stack',
    hero_title2: 'Web Developer',
    hero_subtitle: 'I specialize in building responsive frontend interfaces and scalable backend systems using modern JavaScript technologies. My goal is to create clean, efficient, and impactful digital solutions.',
    explore_projects: 'Explore Projects',
    view_resume: 'View Resume',
    
    // About
    about_me: 'About Me',
    about_p1: 'I am a passionate Full Stack Developer with a strong interest in building modern, responsive, and user-friendly web applications. My primary technologies include HTML, CSS, JavaScript, TypeScript, React, Tailwind CSS, Node.js, Express.js, and MongoDB. I enjoy transforming ideas into real-world digital products while continuously learning new technologies and improving my development skills.',
    about_p2: 'I have experience developing both frontend and backend applications, creating REST APIs, implementing authentication systems, integrating third-party APIs, and designing responsive user interfaces. I focus on writing clean, maintainable, and scalable code while following modern development practices such as Git version control, component-based architecture, and responsive design principles.',
    about_p3: 'My goal is to become a highly skilled software engineer by working on challenging projects, collaborating with talented teams, and continuously expanding my knowledge. I am always eager to learn, solve complex problems, and build applications that provide meaningful value and excellent user experiences.',
    
    // Skills
    tech_stack: 'Tech Stack',
    skills_title: 'Skills & Expertise',
    frontend_dev: 'Frontend Development',
    backend_eng: 'Backend Engineering',
    arch_devops: 'Architecture & DevOps',
    
    // Experience
    work_experience: 'Experience',
    exp1_role: 'Frontend Developer',
    exp1_comp: 'Lova Company',
    exp1_desc: 'Contributed to the development of responsive web applications by building reusable UI components with HTML, CSS, JavaScript, and React. Worked closely with backend developers to integrate REST APIs, optimize application performance, and improve user experience while collaborating in an agile team environment.',
    exp2_role: 'Frontend Mentor',
    exp2_comp: 'PDP Junior',
    exp2_desc: 'Mentored more than 20 students in frontend development, teaching HTML, CSS, JavaScript, and modern web development practices. Guided students through project-based learning, strengthened their problem-solving skills, and supported them in building real-world applications.',
    exp3_role: 'Frontend Developer',
    exp3_comp: 'MohirLab Inc.',
    exp3_desc: 'Developed and maintained modern web applications using React, TypeScript, and JavaScript. Implemented reusable components, integrated REST APIs, fixed bugs, optimized application performance, and collaborated with cross-functional teams to deliver scalable solutions.',
    exp4_role: 'Quality Control Specialist',
    exp4_comp: 'PDP University',
    exp4_desc: 'Worked in the Education Quality Control Department, monitoring academic processes, preparing analytical reports, and contributing to improvements in internal educational systems through data analysis and quality assurance activities.',
    exp5_role: 'Frontend Developer Intern',
    exp5_comp: 'Anorbank',
    exp5_desc: 'Started an internship as a Frontend Developer, participating in the development of the bank\'s digital products and improving user interfaces.',
    
    // Contact
    get_in_touch: 'Get In Touch',
    contact_desc: 'Whether you have a question or want to discuss a complex architecture problem, my inbox is always open. Connect with me on your favorite platform!',
    name: 'Name',
    email: 'Email',
    subject: 'Subject',
    message: 'Message',
    send_message: 'Send Message',
    
    // Projects Preview
    featured_eng: 'My Projects',
    featured_desc: 'A selection of recent web applications and systems I have developed.',
    view_all_projects: 'View All Projects',
    view_online: 'Live Demo',
    view_github: 'Source Code',
    
    // Resume / CV
    cv_title1: 'My',
    cv_title2: 'CV',
    
    // Github Activity
    github_title: 'Open Source Contributions',
    github_days: 'Days I Code',
    github_desc: 'Consistent efforts build great products. Here is a snapshot of my daily coding activity on GitHub.'
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
    hero_title1: 'Full Stack',
    hero_title2: 'Veb Dasturchi',
    hero_subtitle: 'Men zamonaviy JavaScript texnologiyalaridan foydalangan holda moslashuvchan frontend interfeyslari va kengayishga moyil backend tizimlarini yaratishga ixtisoslashganman. Mening maqsadim — toza, samarali va ta\'sirchan raqamli yechimlar yaratishdir.',
    explore_projects: 'Loyihalarni Ko\'rish',
    view_resume: 'Rezyumeni Ko\'rish',
    
    // About
    about_me: 'Men Haqimda',
    about_p1: 'Men zamonaviy, moslashuvchan va qulay veb-ilovalarni yaratishga qiziqishi baland, o\'z kasbiga ishtiyoqmand Full Stack dasturchiman. Asosiy texnologiyalarim HTML, CSS, JavaScript, TypeScript, React, Tailwind CSS, Node.js, Express.js va MongoDB ni o\'z ichiga oladi. Yangi texnologiyalarni doimiy o\'rganish va o\'z mahoratimni oshirish orqali g\'oyalarni haqiqiy raqamli mahsulotlarga aylantirishdan zavq olaman.',
    about_p2: 'Menda frontend va backend ilovalarini ishlab chiqish, REST API\'lar yaratish, autentifikatsiya tizimlarini joriy etish, uchinchi tomon API\'larini integratsiya qilish va moslashuvchan foydalanuvchi interfeyslarini loyihalash bo\'yicha tajriba mavjud. Men Git versiya nazorati, komponentli arxitektura va moslashuvchan dizayn tamoyillari kabi zamonaviy dasturlash amaliyotlariga rioya qilgan holda, toza, qo\'llab-quvvatlanadigan va kengaytirilishi oson bo\'lgan kod yozishga asosiy e\'tiborni qarataman.',
    about_p3: 'Mening maqsadim — murakkab loyihalarda ishlash, iqtidorli jamoalar bilan hamkorlik qilish va bilimlarimni doimiy ravishda kengaytirish orqali yuqori malakali dasturiy ta\'minot muhandisi bo\'lish. Men har doim o\'rganishga, murakkab muammolarni hal qilishga va foydalanuvchilarga foydali hamda ajoyib tajriba taqdim etadigan ilovalarni qurishga tayyorman.',
    
    // Skills
    tech_stack: 'Texnologiyalar',
    skills_title: 'Ko\'nikmalar va Malaka',
    frontend_dev: 'Frontend Dasturlash',
    backend_eng: 'Backend Muhandisligi',
    arch_devops: 'Arxitektura va DevOps',
    
    // Experience
    work_experience: 'Tajriba',
    exp1_role: 'Frontend Dasturchi',
    exp1_comp: 'Lova Company',
    exp1_desc: 'HTML, CSS, JavaScript va React yordamida qayta foydalaniladigan UI komponentlarini yaratish orqali moslashuvchan veb-ilovalarni ishlab chiqishga hissa qo\'shdim. Agile jamoa muhitida REST API\'larni integratsiya qilish, ilova tezligini optimallashtirish va foydalanuvchi tajribasini yaxshilash uchun backend dasturchilar bilan yaqindan hamkorlik qildim.',
    exp2_role: 'Frontend Mentor',
    exp2_comp: 'PDP Junior',
    exp2_desc: '20 dan ortiq o\'quvchilarga frontend dasturlash bo\'yicha ustozlik qildim, HTML, CSS, JavaScript va zamonaviy veb-dasturlash amaliyotlarini o\'rgatdim. O\'quvchilarni loyihaga asoslangan ta\'lim orqali yo\'naltirdim, ularning muammolarni hal qilish ko\'nikmalarini mustahkamladim va haqiqiy loyihalarni yaratishda qo\'llab-quvvatladim.',
    exp3_role: 'Frontend Dasturchi',
    exp3_comp: 'MohirLab Inc.',
    exp3_desc: 'React, TypeScript va JavaScript yordamida zamonaviy veb-ilovalarni ishlab chiqdim va qo\'llab-quvvatladim. Qayta foydalaniladigan komponentlarni joriy qildim, REST API\'larni integratsiya qildim, xatolarni tuzatdim, ilova samaradorligini optimallashtirdim va kengaytirilishi oson bo\'lgan yechimlarni taqdim etish uchun jamoalar bilan hamkorlik qildim.',
    exp4_role: 'Sifat Nazorati Mutaxassisi',
    exp4_comp: 'PDP University',
    exp4_desc: 'Ta\'lim sifatini nazorat qilish bo\'limida ishladim, akademik jarayonlarni monitoring qildim, tahliliy hisobotlar tayyorladim hamda ma\'lumotlarni tahlil qilish va sifat kafolati faoliyati orqali ichki ta\'lim tizimlarini takomillashtirishga hissa qo\'shdim.',
    exp5_role: 'Frontend Dasturchi (Stajyor)',
    exp5_comp: 'Anorbank',
    exp5_desc: 'Frontend dasturchi sifatida stajirovkaga qabul qilindim va bankning raqamli mahsulotlarini rivojlantirish hamda foydalanuvchi interfeyslarini yaxshilashda ishtirok etmoqdaman.',
    
    // Contact
    get_in_touch: 'Bog\'lanish',
    contact_desc: 'Savollaringiz bo\'lsa yoki murakkab arxitektura muammosini muhokama qilmoqchi bo\'lsangiz, men doim ochiqman. O\'zingizga qulay platformada men bilan bog\'laning!',
    name: 'Ism',
    email: 'Elektron pochta',
    subject: 'Mavzu',
    message: 'Xabar',
    send_message: 'Xabarni Jo\'natish',
    
    // Projects Preview
    featured_eng: 'Mening Loyihalarim',
    featured_desc: 'Men yaratgan so\'nggi veb-ilovalar va tizimlarning ayrimlari bilan tanishing.',
    view_all_projects: 'Barcha Loyihalarni Ko\'rish',
    view_online: 'Saytni Ko\'rish',
    view_github: 'Kodni Ko\'rish',
    
    // Resume / CV
    cv_title1: 'Mening',
    cv_title2: 'CV yim',
    
    // Github Activity
    github_title: 'Open Source Hissalarim',
    github_days: 'Kod Yozish Kunlarim',
    github_desc: 'Muntazam harakatlar ajoyib mahsulotlarni yaratadi. Quyida GitHub\'dagi kunlik faolligimning qisqacha ko\'rinishi.'
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
    hero_title1: 'Full Stack',
    hero_title2: 'Веб-разработчик',
    hero_subtitle: 'Я специализируюсь на создании адаптивных frontend-интерфейсов и масштабируемых backend-систем с использованием современных JavaScript-технологий. Моя цель — создавать чистые, эффективные и впечатляющие цифровые решения.',
    explore_projects: 'Смотреть Проекты',
    view_resume: 'Смотреть Резюме',
    
    // About
    about_me: 'Обо мне',
    about_p1: 'Я страстный Full Stack разработчик с сильным интересом к созданию современных, адаптивных и удобных веб-приложений. Мои основные технологии включают HTML, CSS, JavaScript, TypeScript, React, Tailwind CSS, Node.js, Express.js и MongoDB. Мне нравится превращать идеи в реальные цифровые продукты, постоянно изучая новые технологии и совершенствуя свои навыки разработки.',
    about_p2: 'У меня есть опыт разработки как frontend, так и backend приложений, создания REST API, внедрения систем аутентификации, интеграции сторонних API и проектирования адаптивных пользовательских интерфейсов. Я сосредотачиваюсь на написании чистого, поддерживаемого и масштабируемого кода, следуя современным практикам разработки, таким как контроль версий Git, компонентная архитектура и принципы адаптивного дизайна.',
    about_p3: 'Моя цель — стать высококвалифицированным инженером-программистом, работая над сложными проектами, сотрудничая с талантливыми командами и постоянно расширяя свои знания. Я всегда стремлюсь учиться, решать сложные проблемы и создавать приложения, которые приносят реальную пользу и обеспечивают отличный пользовательский опыт.',
    
    // Skills
    tech_stack: 'Технологии',
    skills_title: 'Навыки и Экспертиза',
    frontend_dev: 'Frontend Разработка',
    backend_eng: 'Backend Инженерия',
    arch_devops: 'Архитектура и DevOps',
    
    // Experience
    work_experience: 'Опыт',
    exp1_role: 'Frontend Разработчик',
    exp1_comp: 'Lova Company',
    exp1_desc: 'Внес вклад в разработку адаптивных веб-приложений путем создания переиспользуемых UI-компонентов с помощью HTML, CSS, JavaScript и React. Тесно сотрудничал с backend-разработчиками для интеграции REST API, оптимизации производительности приложений и улучшения пользовательского опыта в гибкой командной среде (Agile).',
    exp2_role: 'Frontend Ментор',
    exp2_comp: 'PDP Junior',
    exp2_desc: 'Был наставником более 20 студентов по frontend-разработке, обучая HTML, CSS, JavaScript и современным практикам веб-разработки. Направлял студентов через проектное обучение, укреплял их навыки решения проблем и помогал в создании реальных приложений.',
    exp3_role: 'Frontend Разработчик',
    exp3_comp: 'MohirLab Inc.',
    exp3_desc: 'Разрабатывал и поддерживал современные веб-приложения с использованием React, TypeScript и JavaScript. Внедрял переиспользуемые компоненты, интегрировал REST API, исправлял ошибки, оптимизировал производительность приложений и сотрудничал с кросс-функциональными командами для предоставления масштабируемых решений.',
    exp4_role: 'Специалист по Контролю Качества',
    exp4_comp: 'PDP University',
    exp4_desc: 'Работал в отделе контроля качества образования, контролируя академические процессы, подготавливая аналитические отчеты и внося вклад в улучшение внутренних образовательных систем посредством анализа данных и мероприятий по обеспечению качества.',
    exp5_role: 'Frontend-разработчик (Стажер)',
    exp5_comp: 'Anorbank',
    exp5_desc: 'Начал стажировку в качестве frontend-разработчика, принимая участие в разработке цифровых продуктов банка и улучшении пользовательских интерфейсов.',
    
    // Contact
    get_in_touch: 'Связаться',
    contact_desc: 'Если у вас есть вопрос или вы хотите обсудить сложную архитектурную задачу, я всегда открыт. Свяжитесь со мной на вашей любимой платформе!',
    name: 'Имя',
    email: 'Email',
    subject: 'Тема',
    message: 'Сообщение',
    send_message: 'Отправить',
    
    // Projects Preview
    featured_eng: 'Мои Проекты',
    featured_desc: 'Ознакомьтесь с подборкой недавних веб-приложений и систем, которые я разработал.',
    view_all_projects: 'Смотреть Все Проекты',
    view_online: 'Посмотреть Сайт',
    view_github: 'Исходный Код',
    
    // Resume / CV
    cv_title1: 'Моё',
    cv_title2: 'Резюме',
    
    // Github Activity
    github_title: 'Вклад в Open Source',
    github_days: 'Дни Программирования',
    github_desc: 'Постоянные усилия создают отличные продукты. Вот снимок моей ежедневной активности на GitHub.'
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
