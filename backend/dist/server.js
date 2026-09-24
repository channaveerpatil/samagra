"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const logger_1 = require("./utils/logger");
const app = (0, app_1.createApp)();
app.listen(env_1.config.port, () => {
    logger_1.logger.info(`Server listening on port ${env_1.config.port} (${env_1.config.nodeEnv})`);
});
//# sourceMappingURL=server.js.map