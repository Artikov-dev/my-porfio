"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProject = exports.autoTranslate = exports.updateProject = exports.createProject = exports.getProject = exports.getAllProjects = void 0;
const project_service_1 = require("../services/project.service");
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
        const { text, from } = req.body;
        if (!text || !from) {
            return res.status(400).json({ status: 'error', message: 'Missing text or from language' });
        }
        const targetLangs = ['en', 'ru', 'uz'].filter(l => l !== from);
        const results = { [from]: text };
        for (const target of targetLangs) {
            // translate requires 'uz' or 'ru' or 'en'
            let translated = await translate(text, { from, to: target });
            results[target] = translated;
        }
        res.status(200).json({ status: 'success', data: results });
    }
    catch (error) {
        console.error('Translation error:', error);
        next(error);
    }
};
exports.autoTranslate = autoTranslate;
const deleteProject = async (req, res, next) => {
    try {
        await project_service_1.ProjectService.deleteProject(req.params.id);
        res.status(200).json({ status: 'success', message: 'Project deleted successfully' });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteProject = deleteProject;
