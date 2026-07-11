"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const seo_controller_1 = require("../controllers/seo.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', seo_controller_1.getSEOSettings);
router.put('/', auth_middleware_1.requireAuth, seo_controller_1.updateSEOSettings);
exports.default = router;
