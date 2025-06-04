"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const entities_1 = require("./entities");
const events_service_1 = require("./services/events.service");
const categories_service_1 = require("./services/categories.service");
const participants_service_1 = require("./services/participants.service");
const events_controller_1 = require("./controllers/events.controller");
const categories_controller_1 = require("./controllers/categories.controller");
const participants_controller_1 = require("./controllers/participants.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRoot({
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: parseInt(process.env.DB_PORT || '5432'),
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_NAME || 'schedular',
                entities: [entities_1.Event, entities_1.Category, entities_1.Participant, entities_1.EventNotification, entities_1.RecurrenceRule],
                synchronize: process.env.NODE_ENV !== 'production',
                logging: process.env.NODE_ENV === 'development',
            }),
            typeorm_1.TypeOrmModule.forFeature([
                entities_1.Event,
                entities_1.Category,
                entities_1.Participant,
                entities_1.EventNotification,
                entities_1.RecurrenceRule,
            ]),
        ],
        controllers: [
            app_controller_1.AppController,
            events_controller_1.EventsController,
            categories_controller_1.CategoriesController,
            participants_controller_1.ParticipantsController,
        ],
        providers: [
            app_service_1.AppService,
            events_service_1.EventsService,
            categories_service_1.CategoriesService,
            participants_service_1.ParticipantsService,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map