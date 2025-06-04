import { PartialType } from '@nestjs/mapped-types';
import { CreateParticipantDto } from './create-participant.dto';

/**
 * UpdateParticipantDto
 * 
 * Extends CreateParticipantDto with all properties made optional
 * Used for updating existing participants via PATCH requests
 */
export class UpdateParticipantDto extends PartialType(CreateParticipantDto) {} 