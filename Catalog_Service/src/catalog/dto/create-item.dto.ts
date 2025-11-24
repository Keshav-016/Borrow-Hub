import {
  IsString,
  IsOptional,
  IsNumber,
  IsUUID,
  IsDecimal,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ConditionTag } from '@prisma/client';

export class CreateItemDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;


  @IsOptional()
  @IsDecimal({ decimal_digits: '1,2' })
  @Type(() => Number)
  pricePerHour?: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1,2' })
  @Type(() => Number)
  pricePerDay?: string;

  @IsOptional()
  @IsDecimal({ decimal_digits: '1,2' })
  @Type(() => Number)
  securityDeposit?: string;

  @IsOptional()
  @IsEnum(ConditionTag)
  conditionTag?: ConditionTag;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  longitude?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  pincode?: string;
}
