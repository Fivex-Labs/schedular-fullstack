"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('database', () => ({
    type: 'postgres',
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    database: process.env.POSTGRES_DB || 'schedular',
    entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true' || process.env.NODE_ENV !== 'production',
    logging: process.env.NODE_ENV === 'development',
}));
//# sourceMappingURL=database.config.js.map