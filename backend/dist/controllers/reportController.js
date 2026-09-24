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
const reportService = __importStar(require("../services/reportService"));
const AppError_1 = require("../utils/AppError");
const VALID_REPORT_TYPES = ['CUSTOMER', 'USER'];
function listReportDefinitions(_req, res) {
    res.status(200).json(reportService.listReportDefinitions());
}
async function listReportJobs(_req, res, next) {
    try {
        res.status(200).json(await reportService.listReportJobs());
    }
    catch (err) {
        next(err);
    }
}
async function getReportJob(req, res, next) {
    try {
        res.status(200).json(await reportService.getReportJob(req.params.id));
    }
    catch (err) {
        next(err);
    }
}
async function generateReport(req, res, next) {
    try {
        const { reportType } = (req.body ?? {});
        if (!reportType || !VALID_REPORT_TYPES.includes(reportType)) {
            throw new AppError_1.AppError(`"reportType" must be one of: ${VALID_REPORT_TYPES.join(', ')}`, 400);
        }
        res.status(201).json(await reportService.generateReport(reportType, req.user.id));
    }
    catch (err) {
        next(err);
    }
}
async function downloadReport(req, res, next) {
    try {
        const { buffer, fileName } = await reportService.downloadReport(req.params.id, req.user.id);
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.status(200).send(buffer);
    }
    catch (err) {
        next(err);
    }
}
//# sourceMappingURL=reportController.js.map