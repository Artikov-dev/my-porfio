"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_service_1 = require("../services/project.service");
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const project_schema_1 = require("../schemas/project.schema");
const rateLimiter_1 = require("../middlewares/rateLimiter");
const router = (0, express_1.Router)();
router.get('/', project_controller_1.getAllProjects);
router.get('/:id', project_controller_1.getProject);
router.post('/:id/view', rateLimiter_1.viewLimiter, async (req, res) => {
    try {
        const counted = await project_service_1.ProjectService.incrementViews(String(req.params.id));
        res.json({ success: true, counted });
    }
    catch (e) {
        res.status(500).json({ success: false });
    }
});
// Protected Admin Routes
router.post('/translate', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(project_schema_1.translateSchema), project_controller_1.autoTranslate);
router.post('/', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(project_schema_1.projectSchema), project_controller_1.createProject);
router.put('/:id', auth_middleware_1.requireAuth, (0, validate_middleware_1.validate)(project_schema_1.projectSchema), project_controller_1.updateProject);
router.delete('/:id', auth_middleware_1.requireAuth, project_controller_1.deleteProject);
exports.default = router;
