"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventNotification = exports.NotificationType = void 0;
const typeorm_1 = require("typeorm");
const event_entity_1 = require("./event.entity");
var NotificationType;
(function (NotificationType) {
    NotificationType["POPUP"] = "popup";
    NotificationType["EMAIL"] = "email";
    NotificationType["PUSH"] = "push";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
let EventNotification = class EventNotification {
    id;
    type;
    timing;
    message;
    isEnabled;
    event;
    createdAt;
    updatedAt;
};
exports.EventNotification = EventNotification;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], EventNotification.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: NotificationType,
        default: NotificationType.POPUP,
    }),
    __metadata("design:type", String)
], EventNotification.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int' }),
    __metadata("design:type", Number)
], EventNotification.prototype, "timing", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], EventNotification.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: true }),
    __metadata("design:type", Boolean)
], EventNotification.prototype, "isEnabled", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => event_entity_1.Event, (event) => event.notifications, { onDelete: 'CASCADE' }),
    __metadata("design:type", event_entity_1.Event)
], EventNotification.prototype, "event", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], EventNotification.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], EventNotification.prototype, "updatedAt", void 0);
exports.EventNotification = EventNotification = __decorate([
    (0, typeorm_1.Entity)('event_notifications')
], EventNotification);
//# sourceMappingURL=event-notification.entity.js.map