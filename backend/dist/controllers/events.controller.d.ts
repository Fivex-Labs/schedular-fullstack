import { EventsService } from '../services/events.service';
import { CreateEventDto, UpdateEventDto } from '../dto';
import { Event } from '../entities/event.entity';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(createEventDto: CreateEventDto): Promise<Event>;
    findAll(startDate?: string, endDate?: string, categoryIds?: string, includeRecurring?: string): Promise<Event[]>;
    search(query: string): Promise<Event[]>;
    findByCategory(categoryId: string): Promise<Event[]>;
    getRecurringInstances(id: string, startDate: string, endDate: string): Promise<Event[]>;
    addExclusionDate(id: string, date: string): Promise<Event>;
    findOne(id: string): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
