import { Event } from './event.entity';
export declare enum NotificationType {
    POPUP = "popup",
    EMAIL = "email",
    PUSH = "push"
}
export declare class EventNotification {
    id: string;
    type: NotificationType;
    timing: number;
    message: string;
    isEnabled: boolean;
    event: Event;
    createdAt: Date;
    updatedAt: Date;
}
