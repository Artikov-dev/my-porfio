"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recordVisit = exports.getLocations = exports.getAnalytics = void 0;
const analytics_service_1 = require("../services/analytics.service");
const ua_parser_js_1 = __importDefault(require("ua-parser-js"));
const geoip_lite_1 = __importDefault(require("geoip-lite"));
const getAnalytics = async (req, res) => {
    try {
        const data = await analytics_service_1.AnalyticsService.getDashboardStats();
        res.json({ success: true, data });
    }
    catch (error) {
        console.error('Analytics Error:', error);
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
        console.error('Get Locations Error:', error);
        res.status(500).json({ success: false, message: 'Server error fetching locations' });
    }
};
exports.getLocations = getLocations;
const recordVisit = async (req, res) => {
    try {
        const { path } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
        const userAgent = req.headers['user-agent'] || '';
        // Parse User Agent
        const parser = new ua_parser_js_1.default(userAgent);
        const browser = parser.getBrowser().name || 'Unknown';
        const os = parser.getOS().name || 'Unknown';
        const device = parser.getDevice().type || 'desktop';
        // Get Country from IP
        let country = 'Unknown';
        if (typeof ip === 'string') {
            const geo = geoip_lite_1.default.lookup(ip.split(',')[0].trim());
            if (geo && geo.country) {
                country = geo.country;
            }
        }
        await analytics_service_1.AnalyticsService.recordVisit({
            ip_address: typeof ip === 'string' ? ip.split(',')[0].trim() : String(ip),
            country,
            browser,
            os,
            device,
            path: path || '/',
        });
        // Emit live location update to sockets
        if (typeof ip === 'string') {
            const geo = geoip_lite_1.default.lookup(ip.split(',')[0].trim());
            if (geo && geo.ll) {
                const io = req.app.get('io');
                if (io) {
                    io.emit('new_visitor_location', { lat: geo.ll[0], lng: geo.ll[1], country: geo.country });
                }
            }
        }
        res.status(200).json({ success: true });
    }
    catch (error) {
        console.error('Record Visit Error:', error);
        res.status(200).json({ success: false });
    }
};
exports.recordVisit = recordVisit;
