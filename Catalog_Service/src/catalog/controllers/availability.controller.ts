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
import { AvailabilityService } from '../services/availability.service';
import { CreateAvailabilityDto } from '../dto';

@Controller('items/:itemId/availability')
export class AvailabilityController {
  constructor(private availabilityService: AvailabilityService) {}

  /**
   * Add availability slot to an item
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addAvailability(
    @Param('itemId') itemId: string,
    @Body() createAvailabilityDto: CreateAvailabilityDto,
  ) {
    return this.availabilityService.addAvailability(itemId, createAvailabilityDto);
  }

  /**
   * List availability slots for an item
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async listAvailability(
    @Param('itemId') itemId: string,
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 50,
  ) {
    return this.availabilityService.listAvailability(itemId, Number(skip), Number(take));
  }

  /**
   * Get available (not booked) slots for an item
   */
  @Get('available-slots')
  @HttpCode(HttpStatus.OK)
  async getAvailableSlots(@Param('itemId') itemId: string) {
    return this.availabilityService.getAvailableSlots(itemId);
  }

  /**
   * Get availability slot by ID
   */
  @Get('slot/:slotId')
  @HttpCode(HttpStatus.OK)
  async getAvailabilitySlot(
    @Param('itemId') itemId: string,
    @Param('slotId') slotId: string,
  ) {
    return this.availabilityService.getAvailabilityById(slotId);
  }

  /**
   * Delete availability slot
   */
  @Delete('slot/:slotId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAvailability(
    @Param('itemId') itemId: string,
    @Param('slotId') slotId: string,
  ) {
    await this.availabilityService.deleteAvailability(slotId);
  }

  /**
   * Block availability during borrow period
   */
  @Post('block-during-borrow')
  @HttpCode(HttpStatus.OK)
  async blockAvailabilityDuringBorrow(
    @Param('itemId') itemId: string,
    @Body()
    body: {
      borrowStart: string;
      borrowEnd: string;
    },
  ) {
    return this.availabilityService.blockAvailabilityDuringBorrow(
      itemId,
      new Date(body.borrowStart),
      new Date(body.borrowEnd),
    );
  }
}
