import {
  IsEnum,
  IsInt,
  IsString,
  IsBoolean,
  IsOptional,
  Min,
} from 'class-validator';
import { NotificationType } from '../entities/event-notification.entity';

/**
 * CreateEventNotificationDto
 * 
 * Maps to EventNotification interface in the frontend
 * Used for defining event notification settings
 */
export class CreateEventNotificationDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsInt()
  @Min(0)
  timing: number; // Minutes before event

  @IsString()
  message: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
} 