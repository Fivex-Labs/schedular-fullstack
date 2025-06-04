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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entities_1 = require("../entities");
let EventsService = class EventsService {
    eventRepository;
    categoryRepository;
    participantRepository;
    recurrenceRuleRepository;
    notificationRepository;
    constructor(eventRepository, categoryRepository, participantRepository, recurrenceRuleRepository, notificationRepository) {
        this.eventRepository = eventRepository;
        this.categoryRepository = categoryRepository;
        this.participantRepository = participantRepository;
        this.recurrenceRuleRepository = recurrenceRuleRepository;
        this.notificationRepository = notificationRepository;
    }
    async create(createEventDto) {
        const { categoryId, participantIds, recurrence, notifications, ...eventData } = createEventDto;
        const event = this.eventRepository.create({
            ...eventData,
            startDate: new Date(eventData.startDate),
            endDate: eventData.endDate ? new Date(eventData.endDate) : undefined,
            isRecurring: !!recurrence,
        });
        if (categoryId) {
            const category = await this.categoryRepository.findOne({
                where: { id: categoryId },
            });
            if (!category) {
                throw new common_1.NotFoundException(`Category with ID ${categoryId} not found`);
            }
            event.category = category;
            event.categoryId = categoryId;
        }
        if (recurrence) {
            const recurrenceRule = await this.createRecurrenceRule(recurrence);
            event.recurrence = recurrenceRule;
        }
        const savedEvent = await this.eventRepository.save(event);
        if (participantIds && participantIds.length > 0) {
            const participants = await this.participantRepository.findBy({
                id: (0, typeorm_2.In)(participantIds),
            });
            savedEvent.participants = participants;
        }
        if (notifications && notifications.length > 0) {
            const eventNotifications = await this.createNotifications(notifications, savedEvent);
            savedEvent.notifications = eventNotifications;
        }
        return this.eventRepository.save(savedEvent);
    }
    async findAll(params) {
        const query = this.eventRepository
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.category', 'category')
            .leftJoinAndSelect('event.participants', 'participants')
            .leftJoinAndSelect('event.notifications', 'notifications')
            .leftJoinAndSelect('event.recurrence', 'recurrence');
        if (params?.startDate && params?.endDate) {
            query.andWhere('event.startDate >= :startDate', {
                startDate: new Date(params.startDate),
            });
            query.andWhere('event.startDate <= :endDate', {
                endDate: new Date(params.endDate),
            });
        }
        if (params?.categoryIds && params.categoryIds.length > 0) {
            query.andWhere('event.categoryId IN (:...categoryIds)', {
                categoryIds: params.categoryIds,
            });
        }
        if (params?.includeRecurring === false) {
            query.andWhere('event.isRecurring = false');
        }
        return query.getMany();
    }
    async findOne(id) {
        const event = await this.eventRepository.findOne({
            where: { id },
            relations: ['category', 'participants', 'notifications', 'recurrence'],
        });
        if (!event) {
            throw new common_1.NotFoundException(`Event with ID ${id} not found`);
        }
        return event;
    }
    async update(id, updateEventDto) {
        const event = await this.findOne(id);
        const { categoryId, participantIds, recurrence, notifications, ...eventData } = updateEventDto;
        if (Object.keys(eventData).length > 0) {
            Object.assign(event, {
                ...eventData,
                startDate: eventData.startDate ? new Date(eventData.startDate) : event.startDate,
                endDate: eventData.endDate ? new Date(eventData.endDate) : event.endDate,
                isRecurring: recurrence ? !!recurrence : event.isRecurring,
            });
        }
        if (categoryId !== undefined) {
            if (categoryId) {
                const category = await this.categoryRepository.findOne({
                    where: { id: categoryId },
                });
                if (!category) {
                    throw new common_1.NotFoundException(`Category with ID ${categoryId} not found`);
                }
                event.category = category;
                event.categoryId = categoryId;
            }
            else {
                event.category = null;
                event.categoryId = null;
            }
        }
        if (recurrence) {
            if (event.recurrence) {
                Object.assign(event.recurrence, {
                    ...recurrence,
                    endDate: recurrence.endDate ? new Date(recurrence.endDate) : null,
                });
                await this.recurrenceRuleRepository.save(event.recurrence);
            }
            else {
                const recurrenceRule = await this.createRecurrenceRule(recurrence);
                event.recurrence = recurrenceRule;
            }
        }
        if (participantIds !== undefined) {
            if (participantIds.length > 0) {
                const participants = await this.participantRepository.findBy({
                    id: (0, typeorm_2.In)(participantIds),
                });
                event.participants = participants;
            }
            else {
                event.participants = [];
            }
        }
        if (notifications !== undefined) {
            if (event.notifications && event.notifications.length > 0) {
                await this.notificationRepository.remove(event.notifications);
            }
            if (notifications.length > 0) {
                const eventNotifications = await this.createNotifications(notifications, event);
                event.notifications = eventNotifications;
            }
            else {
                event.notifications = [];
            }
        }
        return this.eventRepository.save(event);
    }
    async remove(id) {
        const event = await this.findOne(id);
        await this.eventRepository.remove(event);
    }
    async generateRecurringInstances(eventId, startDate, endDate) {
        const baseEvent = await this.findOne(eventId);
        if (!baseEvent.isRecurring || !baseEvent.recurrence) {
            throw new common_1.BadRequestException('Event is not a recurring event');
        }
        const instances = [];
        const rule = baseEvent.recurrence;
        let currentDate = new Date(Math.max(baseEvent.startDate.getTime(), startDate.getTime()));
        let instanceCount = 0;
        while (currentDate <= endDate) {
            const dateString = currentDate.toISOString().split('T')[0];
            if (baseEvent.excludedDates && baseEvent.excludedDates.includes(dateString)) {
                currentDate = this.getNextOccurrence(currentDate, rule);
                continue;
            }
            if (rule.count && instanceCount >= rule.count) {
                break;
            }
            if (rule.endDate && currentDate > rule.endDate) {
                break;
            }
            const instance = this.createEventInstance(baseEvent, currentDate);
            instances.push(instance);
            instanceCount++;
            currentDate = this.getNextOccurrence(currentDate, rule);
        }
        return instances;
    }
    async addExclusionDate(eventId, date) {
        const event = await this.findOne(eventId);
        if (!event.isRecurring) {
            throw new common_1.BadRequestException('Event is not a recurring event');
        }
        if (!event.excludedDates) {
            event.excludedDates = [];
        }
        if (!event.excludedDates.includes(date)) {
            event.excludedDates.push(date);
        }
        return this.eventRepository.save(event);
    }
    async findByCategory(categoryId) {
        return this.eventRepository.find({
            where: { categoryId },
            relations: ['category', 'participants', 'notifications', 'recurrence'],
        });
    }
    async search(query) {
        return this.eventRepository
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.category', 'category')
            .leftJoinAndSelect('event.participants', 'participants')
            .leftJoinAndSelect('event.notifications', 'notifications')
            .leftJoinAndSelect('event.recurrence', 'recurrence')
            .where('event.title ILIKE :query OR event.description ILIKE :query', {
            query: `%${query}%`,
        })
            .getMany();
    }
    async createRecurrenceRule(recurrenceDto) {
        const recurrenceRule = this.recurrenceRuleRepository.create({
            ...recurrenceDto,
            endDate: recurrenceDto.endDate ? new Date(recurrenceDto.endDate) : undefined,
        });
        return this.recurrenceRuleRepository.save(recurrenceRule);
    }
    async createNotifications(notificationsDto, event) {
        const notifications = notificationsDto.map((notificationDto) => this.notificationRepository.create({
            ...notificationDto,
            event,
        }));
        return this.notificationRepository.save(notifications);
    }
    createEventInstance(baseEvent, date) {
        const duration = baseEvent.endDate
            ? baseEvent.endDate.getTime() - baseEvent.startDate.getTime()
            : 0;
        const instance = {
            ...baseEvent,
            id: `${baseEvent.id}-${date.toISOString().split('T')[0]}`,
            startDate: new Date(date),
            endDate: duration > 0 ? new Date(date.getTime() + duration) : undefined,
            parentEventId: baseEvent.id,
            isRecurring: false,
            recurrence: null,
            createdAt: undefined,
            updatedAt: undefined,
        };
        return instance;
    }
    getNextOccurrence(currentDate, rule) {
        const nextDate = new Date(currentDate);
        switch (rule.frequency) {
            case entities_1.RecurrenceFrequency.DAILY:
                if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
                    do {
                        nextDate.setDate(nextDate.getDate() + 1);
                    } while (!rule.daysOfWeek.includes(nextDate.getDay()));
                }
                else {
                    nextDate.setDate(nextDate.getDate() + rule.interval);
                }
                break;
            case entities_1.RecurrenceFrequency.WEEKLY:
                if (rule.daysOfWeek && rule.daysOfWeek.length > 0) {
                    const currentDay = nextDate.getDay();
                    const nextDay = rule.daysOfWeek.find(day => day > currentDay);
                    if (nextDay !== undefined) {
                        nextDate.setDate(nextDate.getDate() + (nextDay - currentDay));
                    }
                    else {
                        const daysUntilNextWeek = 7 - currentDay + rule.daysOfWeek[0];
                        nextDate.setDate(nextDate.getDate() + daysUntilNextWeek);
                    }
                }
                else {
                    nextDate.setDate(nextDate.getDate() + (7 * rule.interval));
                }
                break;
            case entities_1.RecurrenceFrequency.MONTHLY:
                nextDate.setMonth(nextDate.getMonth() + rule.interval);
                if (rule.dayOfMonth) {
                    nextDate.setDate(rule.dayOfMonth);
                }
                break;
            case entities_1.RecurrenceFrequency.YEARLY:
                nextDate.setFullYear(nextDate.getFullYear() + rule.interval);
                if (rule.monthOfYear !== undefined) {
                    nextDate.setMonth(rule.monthOfYear);
                }
                if (rule.dayOfMonth) {
                    nextDate.setDate(rule.dayOfMonth);
                }
                break;
        }
        return nextDate;
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(entities_1.Event)),
    __param(1, (0, typeorm_1.InjectRepository)(entities_1.Category)),
    __param(2, (0, typeorm_1.InjectRepository)(entities_1.Participant)),
    __param(3, (0, typeorm_1.InjectRepository)(entities_1.RecurrenceRule)),
    __param(4, (0, typeorm_1.InjectRepository)(entities_1.EventNotification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], EventsService);
//# sourceMappingURL=events.service.js.map