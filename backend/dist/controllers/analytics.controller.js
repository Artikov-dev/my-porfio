"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordVisit = exports.getLocations = exports.getAnalytics = void 0;
const analytics_service_1 = require("../services/analytics.service");
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const socket_1 = require("../config/socket");
const logger_1 = require("../config/logger");
const getAnalytics = async (req, res) => {
    try {
        const data = await analytics_service_1.AnalyticsService.getDashboardStats();
        res.json({ success: true, data });
    }
    catch (error) {
        logger_1.logger.error(`Analytics error: ${error}`);
        res
            .status(500)
            .json({ success: false, message: 'Server error fetching analytics' });
    }
};
exports.getAnalytics = getAnalytics;
const getLocations = async (req, res) => {
    try {
        const data = await analytics_service_1.AnalyticsService.getVisitorLocations();
        res.json({ success: true, data });
    }
    catch (error) {
        logger_1.logger.error(`Get locations error: ${error}`);
        res.status(500).json({ success: false, message: 'Server error fetching locations' });
    }
};
exports.getLocations = getLocations;
const recordVisit = async (req, res) => {
    try {
        const { path } = req.body;
        // req.ip honours 'trust proxy' (only Render's proxy hop); the raw X-Forwarded-For header can be spoofed by clients
        const ip = (req.ip || req.socket.remoteAddress || '127.0.0.1').split(',')[0].trim();
        const userAgent = req.headers['user-agent'] || '';
        // Parse User Agent
        const parser = new ua_parser_js_1.default(userAgent);
        const browser = parser.getBrowser().name || 'Unknown';
        const os = parser.getOS().name || 'Unknown';
        const device = parser.getDevice().type || 'desktop';
        const geo = geoip_lite_1.default.lookup(ip);
        // Only a salted hash of the IP is stored (enough to count unique visitors), plus the
        // approximate city coordinates the globe needs — never the raw address.
        await analytics_service_1.AnalyticsService.recordVisit({
            ip_hash: (0, analytics_service_1.hashIp)(ip),
            latitude: geo?.ll?.[0] ?? null,
            longitude: geo?.ll?.[1] ?? null,
            country: geo?.country || 'Unknown',
            browser,
            os,
            device,
            path: typeof path === 'string' ? path.slice(0, 200) : '/',
        });
        // Live location update for the admin dashboard only — never broadcast visitor locations to everyone
        if (geo?.ll) {
            const io = req.app.get('io');
            if (io) {
                io.to(socket_1.ADMIN_ROOM).emit('new_visitor_location', { lat: geo.ll[0], lng: geo.ll[1], country: geo.country });
            }
        }
        res.status(200).json({ success: true });
    }
    catch (error) {
        logger_1.logger.error(`Record visit error: ${error}`);
        res.status(200).json({ success: false });
    }
};
exports.recordVisit = recordVisit;
