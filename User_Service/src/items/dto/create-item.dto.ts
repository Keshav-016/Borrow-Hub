import { IsString, IsOptional, IsNumber, IsArray, ValidateNested, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class AvailabilityDto {
  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsOptional()
  isBooked?: boolean;
}

export class CreateItemDto {
  @IsUUID()
  ownerUserId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  pricePerHour?: number;

  @IsOptional()
  @IsNumber()
  pricePerDay?: number;

  @IsOptional()
  @IsNumber()
  securityDeposit?: number;

  @IsOptional()
  @IsString()
  conditionTag?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityDto)
  @IsArray()
  availability?: AvailabilityDto[];
}
