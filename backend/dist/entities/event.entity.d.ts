import { Category } from './category.entity';
import { Participant } from './participant.entity';
import { EventNotification } from './event-notification.entity';
import { RecurrenceRule } from './recurrence-rule.entity';
export declare class Event {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate: Date;
    allDay: boolean;
    color: string;
    textColor: string;
    location: string;
    isRecurring: boolean;
    parentEventId: string;
    excludedDates: string[];
    category: Category | null;
    categoryId: string | null;
    participants: Participant[];
    notifications: EventNotification[];
    recurrence: RecurrenceRule;
    createdAt: Date;
    updatedAt: Date;
}
