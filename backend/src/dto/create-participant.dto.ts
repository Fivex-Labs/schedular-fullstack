import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  IsUrl,
} from 'class-validator';
import { ParticipantStatus } from '../entities/participant.entity';

/**
 * CreateParticipantDto
 * 
 * Maps to Participant interface in the frontend
 * Used for creating new participants
 */
export class CreateParticipantDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsEmail()
  @MaxLength(255)
  email: string;

  @IsUrl()
  avatar: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  role?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  department?: string;

  @IsOptional()
  @IsEnum(ParticipantStatus)
  status?: ParticipantStatus;
} 