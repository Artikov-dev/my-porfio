"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const analytics_service_1 = require("../services/analytics.service");
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
