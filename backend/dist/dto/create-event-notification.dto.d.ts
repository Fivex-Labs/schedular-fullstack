import { NotificationType } from '../entities/event-notification.entity';
export declare class CreateEventNotificationDto {
    type: NotificationType;
    timing: number;
    message: string;
    isEnabled?: boolean;
}
