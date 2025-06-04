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
exports.Event = void 0;
const typeorm_1 = require("typeorm");
const category_entity_1 = require("./category.entity");
const participant_entity_1 = require("./participant.entity");
const event_notification_entity_1 = require("./event-notification.entity");
const recurrence_rule_entity_1 = require("./recurrence-rule.entity");
let Event = class Event {
    id;
    title;
    description;
    startDate;
    endDate;
    allDay;
    color;
    textColor;
    location;
    isRecurring;
    parentEventId;
    excludedDates;
    category;
    categoryId;
    participants;
    notifications;
    recurrence;
    createdAt;
    updatedAt;
};
exports.Event = Event;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Event.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255 }),
    __metadata("design:type", String)
], Event.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], Event.prototype, "startDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], Event.prototype, "endDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "allDay", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 7 }),
    __metadata("design:type", String)
], Event.prototype, "color", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 7, default: '#ffffff' }),
    __metadata("design:type", String)
], Event.prototype, "textColor", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'varchar', length: 255, nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'boolean', default: false }),
    __metadata("design:type", Boolean)
], Event.prototype, "isRecurring", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", String)
], Event.prototype, "parentEventId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Event.prototype, "excludedDates", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => category_entity_1.Category, (category) => category.events, { nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', nullable: true }),
    __metadata("design:type", Object)
], Event.prototype, "categoryId", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => participant_entity_1.Participant, (participant) => participant.events),
    (0, typeorm_1.JoinTable)({
        name: 'event_participants',
        joinColumn: { name: 'eventId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'participantId', referencedColumnName: 'id' },
    }),
    __metadata("design:type", Array)
], Event.prototype, "participants", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => event_notification_entity_1.EventNotification, (notification) => notification.event, {
        cascade: true,
        eager: true,
    }),
    __metadata("design:type", Array)
], Event.prototype, "notifications", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => recurrence_rule_entity_1.RecurrenceRule, { nullable: true, cascade: true, eager: true }),
    __metadata("design:type", recurrence_rule_entity_1.RecurrenceRule)
], Event.prototype, "recurrence", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Event.prototype, "updatedAt", void 0);
exports.Event = Event = __decorate([
    (0, typeorm_1.Entity)('events')
], Event);
//# sourceMappingURL=event.entity.js.map