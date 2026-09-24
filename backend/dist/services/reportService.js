"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.listReportDefinitions = listReportDefinitions;
exports.listReportJobs = listReportJobs;
exports.getReportJob = getReportJob;
exports.generateReport = generateReport;
exports.downloadReport = downloadReport;
const reportJobRepository = __importStar(require("../repositories/reportJobRepository"));
const auditLogService = __importStar(require("./auditLogService"));
const reportGenerationService_1 = require("./reportGenerationService");
const reportFiles_1 = require("../utils/reportFiles");
const Report_1 = require("../models/Report");
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
function listReportDefinitions() {
    return Report_1.REPORT_DEFINITIONS;
}
async function listReportJobs() {
    return reportJobRepository.findAll();
}
async function getReportJob(id) {
    const job = await reportJobRepository.findById(id);
    if (!job) {
        throw new AppError_1.AppError(`Report job "${id}" was not found`, 404);
    }
    return job;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function completeGeneration(job, requestedById) {
    const { buffer, fileName } = await (0, reportGenerationService_1.generateReportFile)(job.reportType);
    const filePath = (0, reportFiles_1.writeReportFile)(fileName, buffer);
    const completed = await reportJobRepository.markCompleted(job.id, fileName, filePath);
    auditLogService.record({
        action: 'REPORT_GENERATED',
        module: 'REPORTS',
        target: completed.reportName,
        description: `Generated the ${completed.reportName} report.`,
    }, requestedById);
    return completed;
}
// The User & Access report intentionally runs in the background with staged
// progress instead of completing inline — a deliberate UX choice (the user
// should see it "processing" for a bit) rather than a technical necessity.
// Every other report type still generates synchronously per the roadmap's
// call to avoid a real queue/worker architecture.
async function generateUserReportInBackground(job, requestedById) {
    try {
        await sleep(1200);
        await reportJobRepository.markProcessing(job.id, 30);
        await sleep(1500);
        await reportJobRepository.markProcessing(job.id, 65);
        await sleep(1500);
        await reportJobRepository.markProcessing(job.id, 90);
        await sleep(800);
        await completeGeneration(job, requestedById);
    }
    catch (err) {
        logger_1.logger.error(`Report job "${job.id}" failed`, err);
        await reportJobRepository.markFailed(job.id, 'Report generation failed. Please try again.');
    }
}
async function generateReport(reportType, requestedById) {
    const definition = Report_1.REPORT_DEFINITIONS.find((report) => report.type === reportType);
    if (!definition) {
        throw new AppError_1.AppError(`Unknown report type "${reportType}"`, 400);
    }
    const job = await reportJobRepository.create(reportType, definition.name, requestedById);
    if (reportType === 'USER') {
        void generateUserReportInBackground(job, requestedById);
        return job;
    }
    try {
        return await completeGeneration(job, requestedById);
    }
    catch (err) {
        logger_1.logger.error(`Report job "${job.id}" failed`, err);
        return reportJobRepository.markFailed(job.id, 'Report generation failed. Please try again.');
    }
}
async function downloadReport(id, requestedById) {
    const job = await reportJobRepository.findById(id);
    if (!job || job.status !== 'COMPLETED' || !job.fileName) {
        throw new AppError_1.AppError('Report is not available for download', 404);
    }
    const filePath = await reportJobRepository.findFilePath(id);
    if (!filePath) {
        throw new AppError_1.AppError('Report file was not found', 404);
    }
    const buffer = (0, reportFiles_1.readReportFile)(filePath);
    auditLogService.record({
        action: 'REPORT_DOWNLOADED',
        module: 'REPORTS',
        target: job.reportName,
        description: `Downloaded the ${job.reportName} report.`,
    }, requestedById);
    return { buffer, fileName: job.fileName };
}
//# sourceMappingURL=reportService.js.map