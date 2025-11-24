import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ItemService, ImageService, AvailabilityService } from './services';
import { ItemController, ImageController, AvailabilityController } from './controllers';

@Module({
  imports: [PrismaModule],
  providers: [ItemService, ImageService, AvailabilityService],
  controllers: [ItemController, ImageController, AvailabilityController],
  exports: [ItemService, ImageService, AvailabilityService],
})
export class CatalogModule {}
