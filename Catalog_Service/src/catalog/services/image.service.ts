import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddImageDto } from '../dto';

@Injectable()
export class ImageService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add images to an item
   */
  async addImagesToItem(itemId: string, images: AddImageDto[]) {
    // Verify item exists
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    // Create all images
    const createdImages = await Promise.all(
      images.map((image) =>
        this.prisma.itemImage.create({
          data: {
            itemId,
            imageUrl: image.imageUrl,
          },
        }),
      ),
    );

    return createdImages;
  }

  /**
   * Add a single image to an item
   */
  async addImage(itemId: string, imageUrl: string) {
    // Verify item exists
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    return this.prisma.itemImage.create({
      data: {
        itemId,
        imageUrl,
      },
    });
  }

  /**
   * Delete an image
   */
  async deleteImage(imageId: string) {
    const image = await this.prisma.itemImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    return this.prisma.itemImage.delete({
      where: { id: imageId },
    });
  }

  /**
   * List all images for an item
   */
  async listImages(itemId: string, skip = 0, take = 50) {
    // Verify item exists
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    const images = await this.prisma.itemImage.findMany({
      where: { itemId },
      skip,
      take,
      orderBy: {
        uploadedAt: 'desc',
      },
    });

    const total = await this.prisma.itemImage.count({
      where: { itemId },
    });

    return { images, total };
  }

  /**
   * Get image by ID
   */
  async getImageById(imageId: string) {
    const image = await this.prisma.itemImage.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      throw new NotFoundException(`Image with ID ${imageId} not found`);
    }

    return image;
  }
}
