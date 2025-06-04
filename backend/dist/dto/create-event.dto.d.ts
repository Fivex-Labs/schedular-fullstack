import { CreateRecurrenceRuleDto } from './create-recurrence-rule.dto';
import { CreateEventNotificationDto } from './create-event-notification.dto';
export declare class CreateEventDto {
    title: string;
    description?: string;
    startDate: string;
    endDate?: string;
    allDay: boolean;
    color: string;
    textColor?: string;
    categoryId?: string;
    location?: string;
    recurrence?: CreateRecurrenceRuleDto;
    notifications?: CreateEventNotificationDto[];
    participantIds?: string[];
}
