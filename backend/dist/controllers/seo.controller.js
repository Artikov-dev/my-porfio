"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSEOSettings = exports.getSEOSettings = void 0;
const seo_service_1 = require("../services/seo.service");
const getSEOSettings = async (req, res, next) => {
    try {
        const settings = await seo_service_1.SEOService.getSettings();
        res.json({ success: true, data: settings });
    }
    catch (error) {
        next(error);
    }
};
exports.getSEOSettings = getSEOSettings;
// Errors go to the global handler, so they are logged instead of disappearing
const updateSEOSettings = async (req, res, next) => {
    try {
        const settings = await seo_service_1.SEOService.updateSettings(req.body);
        res.json({ success: true, data: settings });
    }
    catch (error) {
        next(error);
    }
};
exports.updateSEOSettings = updateSEOSettings;
