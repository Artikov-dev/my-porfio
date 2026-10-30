"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.autoTranslate = exports.updateProject = exports.createProject = exports.getProject = exports.getAllProjects = void 0;
const project_service_1 = require("../services/project.service");
const error_middleware_1 = require("../middlewares/error.middleware");
const logger_1 = require("../config/logger");
const getAllProjects = async (req, res, next) => {
    try {
        const projects = await project_service_1.ProjectService.getAllProjects();
        res.status(200).json({ status: 'success', data: projects });
    }
    catch (error) {
        next(error);
    }
};
exports.getAllProjects = getAllProjects;
const getProject = async (req, res, next) => {
    try {
        const project = await project_service_1.ProjectService.getProjectById(req.params.id);
        res.status(200).json({ status: 'success', data: project });
    }
    catch (error) {
        next(error);
    }
};
exports.getProject = getProject;
const createProject = async (req, res, next) => {
    try {
        const project = await project_service_1.ProjectService.createProject(req.body);
        res.status(201).json({ status: 'success', data: project });
    }
    catch (error) {
        next(error);
    }
};
exports.createProject = createProject;
const updateProject = async (req, res, next) => {
    try {
        const project = await project_service_1.ProjectService.updateProject(req.params.id, req.body);
        res.status(200).json({ status: 'success', data: project });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProject = updateProject;
const autoTranslate = async (req, res, next) => {
    try {
        // Dynamic import for ESM package in CommonJS
        const { default: translate } = await import('translate');
        translate.engine = 'google';
        // Validated by translateSchema: non-empty text, from ∈ en | uz | ru
        const { text, from } = req.body;
        const targetLangs = ['en', 'ru', 'uz'].filter((l) => l !== from);
        const translations = await Promise.all(targetLangs.map((to) => translate(text, { from, to })));
        const results = { [from]: text };
        targetLangs.forEach((lang, i) => {
            results[lang] = translations[i];
        });
        res.status(200).json({ status: 'success', data: results });
    }
    catch (error) {
        logger_1.logger.error(`Translation error: ${error}`);
        next(new error_middleware_1.CustomError('Translation service failed, please try again', 502));
    }
};
exports.autoTranslate = autoTranslate;
const deleteProject = async (req, res, next) => {
    try {
        await project_service_1.ProjectService.deleteProject(req.params.id);
        res
            .status(200)
            .json({ status: 'success', message: 'Project deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProject = deleteProject;
