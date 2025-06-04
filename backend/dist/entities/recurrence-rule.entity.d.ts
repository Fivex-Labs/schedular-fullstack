export declare enum RecurrenceFrequency {
    DAILY = "daily",
    WEEKLY = "weekly",
    MONTHLY = "monthly",
    YEARLY = "yearly"
}
export declare class RecurrenceRule {
    id: string;
    frequency: RecurrenceFrequency;
    interval: number;
    daysOfWeek: number[];
    dayOfMonth: number;
    monthOfYear: number;
    endDate: Date;
    count: number;
    createdAt: Date;
    updatedAt: Date;
}
