"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', project_controller_1.getAllProjects);
router.get('/:id', project_controller_1.getProject);
// Protected Admin Routes
router.post('/translate', auth_middleware_1.requireAuth, project_controller_1.autoTranslate);
router.post('/', auth_middleware_1.requireAuth, project_controller_1.createProject);
router.put('/:id', auth_middleware_1.requireAuth, project_controller_1.updateProject);
router.delete('/:id', auth_middleware_1.requireAuth, project_controller_1.deleteProject);
exports.default = router;
