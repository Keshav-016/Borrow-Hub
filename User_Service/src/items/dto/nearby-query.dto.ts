import { IsNumberString, IsOptional } from 'class-validator';

export class NearbyQueryDto {
  @IsNumberString()
  lat: string;

  @IsNumberString()
  lng: string;

  @IsOptional()
  @IsNumberString()
  radius?: string;
}
