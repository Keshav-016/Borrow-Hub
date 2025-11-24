import { IsString, IsUUID } from 'class-validator';

export class AddImageDto {

  @IsString()
  imageUrl: string;
}
