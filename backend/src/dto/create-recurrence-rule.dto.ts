import {
  IsEnum,
  IsInt,
  IsOptional,
  IsDateString,
  IsArray,
  Min,
  Max,
} from 'class-validator';
import { RecurrenceFrequency } from '../entities/recurrence-rule.entity';

/**
 * CreateRecurrenceRuleDto
 * 
 * Maps to RecurrenceRule interface in the frontend
 * Used for defining event recurrence patterns
 */
export class CreateRecurrenceRuleDto {
  @IsEnum(RecurrenceFrequency)
  frequency: RecurrenceFrequency;

  @IsInt()
  @Min(1)
  interval: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  daysOfWeek?: number[];

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(31)
  dayOfMonth?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(11)
  monthOfYear?: number;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  count?: number;
} 