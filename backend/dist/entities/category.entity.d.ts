import { Event } from './event.entity';
export declare class Category {
    id: string;
    name: string;
    color: string;
    icon: string;
    isVisible: boolean;
    description: string;
    events: Event[];
    createdAt: Date;
    updatedAt: Date;
}
