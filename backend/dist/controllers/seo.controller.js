"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSEOSettings = exports.getSEOSettings = void 0;
const seo_service_1 = require("../services/seo.service");
const getSEOSettings = async (req, res) => {
    try {
        const settings = await seo_service_1.SEOService.getSettings();
        res.json({ success: true, data: settings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.getSEOSettings = getSEOSettings;
const updateSEOSettings = async (req, res) => {
    try {
        const settings = await seo_service_1.SEOService.updateSettings(req.body);
        res.json({ success: true, data: settings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
exports.updateSEOSettings = updateSEOSettings;
