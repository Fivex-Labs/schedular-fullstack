import { EventsService } from './events.service';
import { CreateEventDto } from './create-event.dto';
import { UpdateEventDto } from './update-event.dto';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: EventsService);
    create(createEventDto: CreateEventDto): Promise<import("./event.entity").Event>;
    findAll(start?: string, end?: string): Promise<import("./event.entity").Event[]>;
    findOne(id: string): Promise<import("./event.entity").Event>;
    update(id: string, updateEventDto: UpdateEventDto): Promise<import("./event.entity").Event>;
    remove(id: string): Promise<void>;
}
