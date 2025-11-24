import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { ItemService } from '../services/item.service';
import {
  CreateItemDto,
  UpdateItemDto,
  GeoSearchDto,
} from '../dto';

@Controller('items')
export class ItemController {
  constructor(private itemService: ItemService) {}

  /**
   * Create a new item
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createItem(
    @Body() createItemDto: CreateItemDto,
    @Headers('x-user-id') ownerUserId: string,
  ) {
    return this.itemService.createItem(ownerUserId, createItemDto);
  }

  /**
   * Get item by ID
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getItemById(@Param('id') itemId: string) {
    return this.itemService.getItemById(itemId);
  }

  /**
   * List items by owner
   */
  @Get('owner/my-items')
  @HttpCode(HttpStatus.OK)
  async listItemsByOwner(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 10,
    @Headers('x-user-id') ownerUserId: string,
  ) {
    return this.itemService.listItemsByOwnerId(ownerUserId, Number(skip), Number(take));
  }

  /**
   * Update an item
   */
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async updateItem(
    @Param('id') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
    @Headers('x-user-id') ownerUserId: string,
  ) {
    return this.itemService.updateItem(itemId, ownerUserId, updateItemDto);
  }

  /**
   * Delete an item (soft delete)
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteItem(
    @Param('id') itemId: string,
    @Headers('x-user-id') ownerUserId: string,
  ) {
    await this.itemService.deleteItem(itemId, ownerUserId);
  }

  /**
   * Search items near a location (geo-based search)
   */
  @Post('search/nearby')
  @HttpCode(HttpStatus.OK)
  async findNearbyItems(@Body() geoSearchDto: GeoSearchDto) {
    return this.itemService.findNearbyItems(geoSearchDto);
  }

  /**
   * List all available items
   */
  @Get('')
  @HttpCode(HttpStatus.OK)
  async listAvailableItems(
    @Query('skip') skip: number = 0,
    @Query('take') take: number = 20,
  ) {
    return this.itemService.listAvailableItems(Number(skip), Number(take));
  }
}
