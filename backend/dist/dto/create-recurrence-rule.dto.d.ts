import { RecurrenceFrequency } from '../entities/recurrence-rule.entity';
export declare class CreateRecurrenceRuleDto {
    frequency: RecurrenceFrequency;
    interval: number;
    daysOfWeek?: number[];
    dayOfMonth?: number;
    monthOfYear?: number;
    endDate?: string;
    count?: number;
}
