"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
// Endpoint for analytics data (admin only)
router.get('/', auth_middleware_1.requireAuth, analytics_controller_1.getAnalytics);
// Endpoint to record a visit (public)
router.post('/visit', rateLimiter_1.visitLimiter, analytics_controller_1.recordVisit);
// Endpoint for visitor locations (admin only — only the admin dashboard globe uses it)
router.get('/locations', auth_middleware_1.requireAuth, analytics_controller_1.getLocations);
exports.default = router;
