import { IsString, IsOptional, IsBoolean, IsDate, IsHexColor } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  allDay?: boolean = false;

  @IsHexColor()
  @IsOptional()
  color?: string = '#3B82F6';
} 