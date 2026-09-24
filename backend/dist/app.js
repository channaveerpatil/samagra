"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const requestLogger_1 = require("./middleware/requestLogger");
const notFoundHandler_1 = require("./middleware/notFoundHandler");
const errorHandler_1 = require("./middleware/errorHandler");
const auth_1 = require("./middleware/auth");
const env_1 = require("./config/env");
function createApp() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: env_1.config.corsOrigin, credentials: true }));
    app.use(express_1.default.json());
    app.use(requestLogger_1.requestLogger);
    app.use(auth_1.attachUser);
    app.use('/api', routes_1.default);
    app.use(notFoundHandler_1.notFoundHandler);
    app.use(errorHandler_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map