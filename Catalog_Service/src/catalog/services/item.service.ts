import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateItemDto, UpdateItemDto, GeoSearchDto } from '../dto';
import { ItemStatus } from '@prisma/client';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new item
   */
  async createItem(ownerUserId: string, createItemDto: CreateItemDto) {
    return this.prisma.item.create({
      data: {
        ownerUserId,
        ...createItemDto,
      },
      include: {
        images: true,
        availability: true,
        category: true,
      },
    });
  }

  /**
   * Get item by ID
   */
  async getItemById(itemId: string) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      include: {
        images: true,
        availability: true,
        category: true,
      },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    return item;
  }

  /**
   * List all items by owner
   */
  async listItemsByOwnerId(ownerUserId: string, skip = 0, take = 10) {
    const items = await this.prisma.item.findMany({
      where: {
        ownerUserId,
        status: { not: ItemStatus.DELETED },
      },
      include: {
        images: true,
        availability: true,
        category: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prisma.item.count({
      where: {
        ownerUserId,
        status: { not: ItemStatus.DELETED },
      },
    });

    return { items, total };
  }

  /**
   * Update an item
   */
  async updateItem(itemId: string, ownerUserId: string, updateItemDto: UpdateItemDto) {
    // Verify ownership
    const item = await this.getItemById(itemId);
    if (item.ownerUserId !== ownerUserId) {
      throw new BadRequestException('You do not have permission to update this item');
    }

    return this.prisma.item.update({
      where: { id: itemId },
      data: updateItemDto,
      include: {
        images: true,
        availability: true,
        category: true,
      },
    });
  }

  /**
   * Soft delete an item (set status to DELETED)
   */
  async deleteItem(itemId: string, ownerUserId: string) {
    // Verify ownership
    const item = await this.getItemById(itemId);
    if (item.ownerUserId !== ownerUserId) {
      throw new BadRequestException('You do not have permission to delete this item');
    }

    return this.prisma.item.update({
      where: { id: itemId },
      data: { status: ItemStatus.DELETED },
      include: {
        images: true,
        availability: true,
        category: true,
      },
    });
  }

  /**
   * Find nearby items using Haversine formula
   */
  async findNearbyItems(geoSearchDto: GeoSearchDto) {
    const { latitude, longitude, radiusKm, limit = 20 } = geoSearchDto;

    const query = `
      SELECT *, (
        6371 * acos(
          cos(radians($1::float)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians($2::float)) +
          sin(radians($1::float)) *
          sin(radians(latitude))
        )
      ) AS distance
      FROM "Item"
      WHERE status = 'AVAILABLE'
      AND latitude IS NOT NULL
      AND longitude IS NOT NULL
      HAVING (
        6371 * acos(
          cos(radians($1::float)) *
          cos(radians(latitude)) *
          cos(radians(longitude) - radians($2::float)) +
          sin(radians($1::float)) *
          sin(radians(latitude))
        )
      ) < $3::float
      ORDER BY distance ASC
      LIMIT $4::int
    `;

    const items = await this.prisma.$queryRawUnsafe(
      query,
      latitude,
      longitude,
      radiusKm,
      limit,
    );

    return items;
  }

  /**
   * List all available items (with pagination)
   */
  async listAvailableItems(skip = 0, take = 20) {
    const items = await this.prisma.item.findMany({
      where: {
        status: ItemStatus.AVAILABLE,
      },
      include: {
        images: true,
        availability: true,
        category: true,
      },
      skip,
      take,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const total = await this.prisma.item.count({
      where: { status: ItemStatus.AVAILABLE },
    });

    return { items, total };
  }
}
