import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class GeoSearchDto {
  @IsNumber()
  @Type(() => Number)
  latitude: number;

  @IsNumber()
  @Type(() => Number)
  longitude: number;

  @IsNumber()
  @Type(() => Number)
  radiusKm: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;
}
