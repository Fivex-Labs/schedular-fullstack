import {
  IsString,
  IsOptional,
  IsBoolean,
  IsDateString,
  IsUUID,
  IsArray,
  ValidateNested,
  IsNotEmpty,
  IsHexColor,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateRecurrenceRuleDto } from './create-recurrence-rule.dto';
import { CreateEventNotificationDto } from './create-event-notification.dto';

/**
 * CreateEventDto
 * 
 * Maps to NewEvent interface in the frontend
 * Used for creating new events via API
 */
export class CreateEventDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsBoolean()
  allDay: boolean;

  @IsHexColor()
  color: string;

  @IsOptional()
  @IsHexColor()
  textColor?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateRecurrenceRuleDto)
  recurrence?: CreateRecurrenceRuleDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEventNotificationDto)
  notifications?: CreateEventNotificationDto[];

  @IsOptional()
  @IsArray()
  @IsUUID('4', { each: true })
  participantIds?: string[];
} 