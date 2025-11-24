import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAvailabilityDto } from '../dto';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  /**
   * Add availability slot for an item
   */
  async addAvailability(itemId: string, createAvailabilityDto: CreateAvailabilityDto) {
    // Verify item exists
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    const startTime = new Date(createAvailabilityDto.startTime);
    const endTime = new Date(createAvailabilityDto.endTime);

    // Validate times
    if (startTime >= endTime) {
      throw new BadRequestException('Start time must be before end time');
    }

    return this.prisma.itemAvailability.create({
      data: {
        itemId,
        startTime,
        endTime,
        isBooked: false,
      },
    });
  }

  /**
   * Block availability during a borrow period
   */
  async blockAvailabilityDuringBorrow(
    itemId: string,
    borrowStart: Date,
    borrowEnd: Date,
  ) {
    // Verify item exists
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    // Find overlapping availability slots
    const overlappingSlots = await this.prisma.itemAvailability.findMany({
      where: {
        itemId,
        AND: [
          { startTime: { lt: borrowEnd } },
          { endTime: { gt: borrowStart } },
        ],
      },
    });

    // Mark overlapping slots as booked
    const blockedSlots = await Promise.all(
      overlappingSlots.map((slot) =>
        this.prisma.itemAvailability.update({
          where: { id: slot.id },
          data: { isBooked: true },
        }),
      ),
    );

    return blockedSlots;
  }

  /**
   * List availability slots for an item
   */
  async listAvailability(itemId: string, skip = 0, take = 50) {
    // Verify item exists
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    const availabilitySlots = await this.prisma.itemAvailability.findMany({
      where: { itemId },
      skip,
      take,
      orderBy: {
        startTime: 'asc',
      },
    });

    const total = await this.prisma.itemAvailability.count({
      where: { itemId },
    });

    return { availabilitySlots, total };
  }

  /**
   * Get availability slot by ID
   */
  async getAvailabilityById(availabilityId: string) {
    const availability = await this.prisma.itemAvailability.findUnique({
      where: { id: availabilityId },
    });

    if (!availability) {
      throw new NotFoundException(`Availability slot with ID ${availabilityId} not found`);
    }

    return availability;
  }

  /**
   * Delete availability slot
   */
  async deleteAvailability(availabilityId: string) {
    const availability = await this.getAvailabilityById(availabilityId);

    return this.prisma.itemAvailability.delete({
      where: { id: availabilityId },
    });
  }

  /**
   * Get available slots (not booked) for an item
   */
  async getAvailableSlots(itemId: string) {
    // Verify item exists
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      throw new NotFoundException(`Item with ID ${itemId} not found`);
    }

    return this.prisma.itemAvailability.findMany({
      where: {
        itemId,
        isBooked: false,
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }
}
