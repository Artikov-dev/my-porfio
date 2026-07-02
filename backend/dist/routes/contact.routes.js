"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const contact_controller_1 = require("../controllers/contact.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/', contact_controller_1.submitContact);
router.get('/messages', auth_middleware_1.requireAuth, contact_controller_1.getMessages);
exports.default = router;
