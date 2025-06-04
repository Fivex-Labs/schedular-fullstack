import { Repository } from 'typeorm';
import { Event, Category, Participant, RecurrenceRule, EventNotification } from '../entities';
import { CreateEventDto, UpdateEventDto } from '../dto';
export declare class EventsService {
    private readonly eventRepository;
    private readonly categoryRepository;
    private readonly participantRepository;
    private readonly recurrenceRuleRepository;
    private readonly notificationRepository;
    constructor(eventRepository: Repository<Event>, categoryRepository: Repository<Category>, participantRepository: Repository<Participant>, recurrenceRuleRepository: Repository<RecurrenceRule>, notificationRepository: Repository<EventNotification>);
    create(createEventDto: CreateEventDto): Promise<Event>;
    findAll(params?: {
        startDate?: string;
        endDate?: string;
        categoryIds?: string[];
        includeRecurring?: boolean;
    }): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    remove(id: string): Promise<void>;
    generateRecurringInstances(eventId: string, startDate: Date, endDate: Date): Promise<Event[]>;
    addExclusionDate(eventId: string, date: string): Promise<Event>;
    findByCategory(categoryId: string): Promise<Event[]>;
    search(query: string): Promise<Event[]>;
    private createRecurrenceRule;
    private createNotifications;
    private createEventInstance;
    private getNextOccurrence;
}
