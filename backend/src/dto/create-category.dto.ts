import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsHexColor,
  MaxLength,
} from 'class-validator';

/**
 * CreateCategoryDto
 * 
 * Maps to EventCategory interface in the frontend
 * Used for creating new event categories
 */
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsHexColor()
  color: string;

  @IsString()
  @MaxLength(10)
  icon: string;

  @IsOptional()
  @IsBoolean()
  isVisible?: boolean;

  @IsOptional()
  @IsString()
  description?: string;
} 