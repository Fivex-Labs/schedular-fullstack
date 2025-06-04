import { Repository } from 'typeorm';
import { Event } from './event.entity';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
export declare class EventsService {
    private readonly eventRepository;
    constructor(eventRepository: Repository<Event>);
    create(createEventDto: CreateEventDto): Promise<Event>;
    findAll(): Promise<Event[]>;
    findOne(id: string): Promise<Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<Event>;
    remove(id: string): Promise<void>;
    findByDateRange(startDate: Date, endDate: Date): Promise<Event[]>;
}
