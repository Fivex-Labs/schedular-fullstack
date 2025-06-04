import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoryDto } from './create-category.dto';

/**
 * UpdateCategoryDto
 * 
 * Extends CreateCategoryDto with all properties made optional
 * Used for updating existing categories via PATCH requests
 */
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {} 