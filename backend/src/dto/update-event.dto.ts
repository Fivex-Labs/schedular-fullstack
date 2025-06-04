import { PartialType } from '@nestjs/mapped-types';
import { CreateEventDto } from './create-event.dto';

/**
 * UpdateEventDto
 * 
 * Extends CreateEventDto with all properties made optional
 * Used for updating existing events via PATCH requests
 */
export class UpdateEventDto extends PartialType(CreateEventDto) {} 