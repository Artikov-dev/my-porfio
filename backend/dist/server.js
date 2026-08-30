"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Trigger deployment
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = require("./config/database");
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = require("./config/logger");
const swagger_1 = require("./config/swagger");
const rateLimiter_1 = require("./middlewares/rateLimiter");
const error_middleware_1 = require("./middlewares/error.middleware");
require("./config/redis"); // Initializes Redis connection
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const socket_1 = require("./config/socket");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const project_routes_1 = __importDefault(require("./routes/project.routes"));
const blog_routes_1 = __importDefault(require("./routes/blog.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const seo_routes_1 = __importDefault(require("./routes/seo.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const system_routes_1 = __importDefault(require("./routes/system.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Trust proxy (Render uses reverse proxy)
app.set('trust proxy', 1);
// CORS - MUST be first middleware to handle preflight requests
const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
    : ['http://localhost:5173'];
const corsOptions = {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};
app.use((0, cors_1.default)(corsOptions));
// Security & Logging
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use((0, morgan_1.default)('combined', {
    stream: { write: (message) => logger_1.logger.info(message.trim()) },
}));
app.use(rateLimiter_1.globalLimiter);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/projects', project_routes_1.default);
app.use('/api/blogs', blog_routes_1.default);
app.use('/api/contact', contact_routes_1.default);
app.use('/api/seo', seo_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/system', system_routes_1.default);
// API Documentation
(0, swagger_1.setupSwagger)(app);
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});
// Global Error Handler (must be the last middleware)
app.use(error_middleware_1.errorHandler);
// Initialize server
const startServer = async () => {
    await (0, database_1.connectDB)();
    const httpServer = http_1.default.createServer(app);
    const io = (0, socket_1.setupSocket)(httpServer);
    app.set('io', io);
    httpServer.listen(PORT, () => {
        logger_1.logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
};
startServer();
