import { Event } from './event.entity';
export declare enum ParticipantStatus {
    ACCEPTED = "accepted",
    DECLINED = "declined",
    PENDING = "pending",
    MAYBE = "maybe"
}
export declare class Participant {
    id: string;
    name: string;
    email: string;
    avatar: string;
    role: string;
    department: string;
    status: ParticipantStatus;
    events: Event[];
    createdAt: Date;
    updatedAt: Date;
}
