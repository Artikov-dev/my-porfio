"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const system_controller_1 = require("../controllers/system.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/health', auth_middleware_1.requireAuth, system_controller_1.getSystemHealth);
router.get('/logs', auth_middleware_1.requireAuth, system_controller_1.getSystemLogs);
exports.default = router;
