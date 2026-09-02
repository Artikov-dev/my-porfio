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
      en: 'Building High Performance Modern Web Apps with React 19 & TypeScript',
      uz: 'React 19 va TypeScript Yordamida Yuqori Unumdor Veb Ilovalar Yaratish',
      ru: 'Создание Высокопроизводительных Веб-приложений на React 19 и TypeScript',
    },
    content: {
      en: `### Introduction

In modern web development, speed and responsiveness are non-negotiable. Building applications that scale seamlessly to thousands of concurrent users requires combining modern frontend architectures with solid backend practices.

### 1. Server Actions & React 19 Compiler
React 19 introduces automated memoization via the React Compiler and streamlined async state transitions with \`useActionState\` and \`useOptimistic\`.

\`\`\`typescript
// Example: Optimistic UI updates in React 19
const [optimisticState, setOptimistic] = useOptimistic(
  currentState,
  (state, update) => ({ ...state, ...update })
);
\`\`\`

### 2. Code Splitting & Dynamic Imports
Avoid sending bloated JavaScript bundles to your users:
- Lazy load non-critical routes with \`React.lazy()\`
- Optimize Three.js / Canvas scenes to only render in the viewport
- Use modern formats (WebP, AVIF) for asset delivery

### 3. State Management & Zero-Lag UX
Use lightweight state libraries or native React Context with split providers to prevent unnecessary re-renders. Combined with TanStack Query, your network state stays synchronized with zero boilerplate.

### Key Takeaways
1. Always profile bundle size using analyzer tools.
2. Leverage browser caching and edge caching for static assets.
3. Optimize for Web Vitals: LCP < 1.2s, FID/INP < 50ms, CLS = 0.`,
      uz: `### Kirish

Zamonaviy veb-dasturlashda tezlik va optimal unumdorlik eng asosiy talablardan biridir. Minglab foydalanuvchilarga xizmat ko'rsata oladigan tizimlarni qurish nafaqat chiroyli interfeys, balki to'g'ri me'moriy yondashuvni talab qiladi.

### 1. React 19 va Kompilyator Imkoniyatlari
React 19 da avtomatik memoizatsiya va asinxron holatlarni boshqarish uchun \`useActionState\` hamda \`useOptimistic\` hooklari taqdim etildi.

\`\`\`typescript
// React 19 da optimistik holat yangilanishi
const [optimisticState, setOptimistic] = useOptimistic(
  currentState,
  (state, update) => ({ ...state, ...update })
);
\`\`\`

### 2. Kodni Bo'laklash (Code Splitting)
Foydalanuvchiga barcha JS fayllarni bittada yuklash o'rniga:
- Marshrutlarni \`React.lazy()\` yordamida yuklang
- Og'ir 3D (Three.js) grafikalarni faqat kerakli vaqtda ishga tushiring
- Rasmlarni WebP yoki AVIF formatida siqilgan holda uzating

### 3. Ma'lumotlarni Keshlash va Real-vaqt Tezligi
TanStack Query va Redis kombinatsiyasi ma'lumotlar bazasiga tushadigan yuklamani 80% gacha kamaytiradi va sahifalarning darhol ochilishini ta'minlaydi.

### Xulosalar
1. Har bir sahifaning bundle hajmini nazorat qiling.
2. Web Vitals ko'rsatkichlariga amal qiling (LCP < 1.2s, INP < 50ms).
3. Foydalanuvchi tajribasini birinchi o'ringa qo'ying.`,
      ru: `### Введение

В современной веб-разработке скорость и отзывчивость являются ключевыми факторами успеха. Создание приложений, масштабируемых на тысячи пользователей, требует гармоничного сочетания современного фронтенда и надежного бэкенда.

### 1. Нововведения в React 19
React 19 упрощает работу с асинхронными операциями и оптимистичными обновлениями с помощью хуков \`useActionState\` и \`useOptimistic\`.

\`\`\`typescript
// Пример оптимистичного обновления интерфейса
const [optimisticState, setOptimistic] = useOptimistic(
  currentState,
  (state, update) => ({ ...state, ...update })
);
\`\`\`

### 2. Разделение кода и оптимизация бандла
Не отправляйте пользователю гигантские JS-бандлы:
- Используйте \`React.lazy()\` для динамической загрузки страниц
- Инициализируйте 3D/Three.js сцены только при попадании в viewport
- Сжимайте медиа в WebP и AVIF

### 3. Кеширование данных
Использование TanStack Query и Redis позволяет сократить количество запросов к базе данных и сделать отклик интерфейса мгновенным.

### Итоги
1. Контролируйте размер бандла перед деплоем.
2. Ориентируйтесь на показатели Core Web Vitals (LCP < 1.2s, CLS = 0).
3. Ставьте удобство пользователя на первое место.`,
    },
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop',
    tags: ['Architecture', 'React 19', 'Performance', 'TypeScript'],
    reading_time: 4,
    views: 248,
    created_at: '2026-08-15T10:30:00.000Z',
  },
  {
    id: 'blog-2',
    title: {
      en: 'Mastering Real-time WebSockets with Node.js & Socket.io',
      uz: 'Node.js va Socket.io Yordamida Real-vaqtdagi WebSockets Texnologiyasini Mukammal O\'rganish',
      ru: 'Освоение Real-time WebSockets с помощью Node.js и Socket.io',
    },
    content: {
      en: `### Why WebSockets?

Traditional HTTP polling creates massive network overhead. WebSockets establish a persistent, full-duplex TCP connection between client and server, allowing instantaneous two-way data streaming.

### 1. Connection Architecture & Handshake
When a client connects, an initial HTTP handshake upgrades the protocol to WebSocket:

\`\`\`javascript
// Server-side Socket.io room management
io.on('connection', (socket) => {
  const sessionId = socket.handshake.auth.token;
  socket.join(\`room_\${sessionId}\`);
  
  socket.on('client:message', (payload) => {
    io.to(\`room_\${sessionId}\`).emit('server:message', payload);
  });
});
\`\`\`

### 2. Resilience and Heartbeats
- Implement heartbeat pings to detect broken connections.
- Automatically fallback to long-polling if corporate firewalls block WebSocket traffic.
- Use Redis Adapter for multi-server horizontal scaling.

### 3. Security Considerations
Always authenticate WebSocket handshakes with JWT tokens and apply rate limiting on event emission to prevent DDoS vulnerabilities.`,
      uz: `### Nima Uchun WebSockets?

An'anaviy HTTP polling har safar yangi so'rov yuborib tarmoqni band qiladi. WebSocket esa mijoz va server o'rtasida bitta doimiy, to'liq dupleks (ikki tomonlama) TCP aloqa kanalini ochadi.

### 1. Bog'lanish Me'moriyati
Mijoz ulanganda dastlabki HTTP handshake orqali protokol WebSocket'ga ko'tariladi:

\`\`\`javascript
// Serverda Socket.io xonalarini boshqarish
io.on('connection', (socket) => {
  const sessionId = socket.handshake.auth.token;
  socket.join(\`room_\${sessionId}\`);
  
  socket.on('client:message', (payload) => {
    io.to(\`room_\${sessionId}\`).emit('server:message', payload);
  });
});
\`\`\`

### 2. Uzluksiz Ishlashni Ta'minlash
- Aloqa uzilganini aniqlash uchun muntazam heartbeat (ping/pong) signallarini yuboring.
- WebSocket bloklangan tarmoqlarda avtomatik Long-Polling ga o'tish mexanizmini yoqing.
- Bir nechta serverlarni birlashtirish uchun Redis Adapter'dan foydalaning.

### 3. Xavfsizlik
WebSocket ulanishini har doim JWT token orqali tasdiqlang va haddan tashqari ko'p xabarlarni cheklash uchun Rate Limiter o'rnating.`,
      ru: `### Зачем нужны WebSockets?

Традиционный HTTP-поллинг перегружает сеть повторными запросами. WebSockets устанавливают постоянное двунаправленное соединение между клиентом и сервером.

### 1. Архитектура соединения
При первом подключении происходит HTTP handshake, который переключает протокол на WebSocket:

\`\`\`javascript
// Управление комнатами в Socket.io
io.on('connection', (socket) => {
  const sessionId = socket.handshake.auth.token;
  socket.join(\`room_\${sessionId}\`);
  
  socket.on('client:message', (payload) => {
    io.to(\`room_\${sessionId}\`).emit('server:message', payload);
  });
});
\`\`\`

### 2. Отказоустойчивость
- Настройте периодические проверки связи (ping/pong).
- Обеспечьте fallback на long-polling при блокировках сети.
- Используйте Redis Adapter для масштабирования на несколько серверов.

### 3. Безопасность
Всегда валидируйте JWT токен на этапе подключения и защищайте сокеты от спам-атак.`,
    },
    image_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
    tags: ['WebSockets', 'Socket.io', 'Node.js', 'Real-Time'],
    reading_time: 5,
    views: 189,
    created_at: '2026-08-28T14:15:00.000Z',
  },
  {
    id: 'blog-3',
    title: {
      en: 'Clean Code & Scalable Backend Architectures in Node.js',
      uz: 'Node.js da Toza Kod (Clean Code) va Kengaytiriladigan Backend Arxitekturasi',
      ru: 'Чистый Код и Масштабируемая Архитектура Бэкенда на Node.js',
    },
    content: {
      en: `### Building Maintainable Backends

When building enterprise applications, writing maintainable code is just as vital as delivering features quickly. A layered architecture separates concerns and makes unit testing straightforward.

### 1. Controller - Service - Repository Pattern
- **Routes / Controllers:** Handle HTTP requests, input validation, and response formatting.
- **Services:** Contain pure business logic, orchestration, and domain rules.
- **Repository / Database Layer:** Manage raw database queries, transactions, and caching.

\`\`\`typescript
// Service Layer Example
export class UserService {
  async registerUser(dto: CreateUserDto) {
    const existing = await UserRepository.findByEmail(dto.email);
    if (existing) throw new AppError('Email already registered', 400);
    
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    return UserRepository.create({ ...dto, password: hashedPassword });
  }
}
\`\`\`

### 2. Centralized Error Handling
Avoid try/catch soup by delegating unhandled rejections to a centralized Express error middleware with typed custom errors.

### 3. Database Indexes & Performance
- Index frequently queried foreign keys and search columns.
- Keep connection pools configured properly for production loads.`,
      uz: `### Kengaytiriladigan Backend Tizimini Qurish

Katta loyihalarda kodning toza va oson o'qilishi uning uzoq muddat barqaror ishlashini ta'minlaydi. Qatlamli (Layered) arxitektura vazifalarni aniq ajratib beradi.

### 1. Controller - Service - Repository Modeli
- **Routes / Controllers:** So'rovlarni qabul qilish, validatsiya va javob qaytarish.
- **Services:** Asosiy biznes mantiq va qoidalarni bajarish.
- **Repository / DB Qatlami:** Ma'lumotlar bazasi so'rovlari va keshlash.

\`\`\`typescript
// Xizmat (Service) Qatlami Namunasi
export class UserService {
  async registerUser(dto: CreateUserDto) {
    const existing = await UserRepository.findByEmail(dto.email);
    if (existing) throw new AppError('Email allaqachon mavjud', 400);
    
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    return UserRepository.create({ ...dto, password: hashedPassword });
  }
}
\`\`\`

### 2. Markazlashgan Xatolarni Boshqarish
Har bir funksiyada try/catch yozish o'rniga, Express da markaziy xatolar middleware tizimidan foydalaning.

### 3. Ma'lumotlar Bazasi Indekslari
Tez-tez qidiriladigan maydonlarga (email, user_id, status) indekslar qo'yish so'rovlar tezligini 10 barobargacha oshiradi.`,
      ru: `### Создание поддерживаемого бэкенда

В крупных проектах читаемость и структурированность кода имеют решающее значение. Многослойная архитектура позволяет четко разделить ответственность между компонентами.

### 1. Паттерн Controller - Service - Repository
- **Controllers:** Прием запросов, валидация и отправка ответов.
- **Services:** Бизнес-логика и правила приложения.
- **Repository:** Запросы к базе данных и кеширование.

\`\`\`typescript
// Пример сервисного слоя
export class UserService {
  async registerUser(dto: CreateUserDto) {
    const existing = await UserRepository.findByEmail(dto.email);
    if (existing) throw new AppError('Email уже используется', 400);
    
    const hashedPassword = await bcrypt.hash(dto.password, 12);
    return UserRepository.create({ ...dto, password: hashedPassword });
  }
}
\`\`\`

### 2. Централизованная обработка ошибок
Используйте глобальный middleware в Express вместо бесконечных блоков try/catch в каждом контроллере.

### 3. Индексы в базе данных
Индексирование часто запрашиваемых полей ускоряет выборку в разы и снижает нагрузку на сервер.`,
    },
    image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2068&auto=format&fit=crop',
    tags: ['Node.js', 'Clean Code', 'Architecture', 'PostgreSQL'],
    reading_time: 6,
    views: 312,
    created_at: '2026-09-01T09:00:00.000Z',
  },
];
