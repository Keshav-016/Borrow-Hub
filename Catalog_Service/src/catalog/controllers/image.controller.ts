import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ImageService } from '../services/image.service';
import { AddImageDto } from '../dto';

@Controller('items/:itemId/images')
export class ImageController {
  constructor(private imageService: ImageService) {}

  /**
   * Add images to an item
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addImages(
    @Param('itemId') itemId: string,
    @Body() images: AddImageDto[],
  ) {
    return this.imageService.addImagesToItem(itemId, images);
  }

  /**
   * Add a single image to an item
   */
  @Post('single')
  @HttpCode(HttpStatus.CREATED)
  async addImage(
    @Param('itemId') itemId: string,
    @Body() addImageDto: AddImageDto,
  ) {
    return this.imageService.addImage(itemId, addImageDto.imageUrl);
  }

  /**
   * List images for an item
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async listImages(
    @Param('itemId') itemId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 50,
  ) {
    return this.imageService.listImages(itemId, Number(skip), Number(take));
  }

  /**
   * Get image by ID
   */
  @Get(':imageId')
  @HttpCode(HttpStatus.OK)
  async getImage(
    @Param('itemId') itemId: string,
    @Param('imageId') imageId: string,
  ) {
    return this.imageService.getImageById(imageId);
  }

  /**
   * Delete an image
   */
  @Delete(':imageId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteImage(
    @Param('itemId') itemId: string,
    @Param('imageId') imageId: string,
  ) {
    await this.imageService.deleteImage(imageId);
  }
}
