import { Controller, Post, Body, Get, Param, Put, Delete, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { NearbyQueryDto } from './dto/nearby-query.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() dto: CreateItemDto) {
    return this.itemsService.create(dto);
  }

  @Get()
  findAll() {
    return this.itemsService.findAll();
  }

  @Get('nearby')
  @UsePipes(new ValidationPipe({ transform: true }))
  nearby(@Query() q: NearbyQueryDto) {
    const lat = parseFloat(q.lat);
    const lng = parseFloat(q.lng);
    const radius = q.radius ? parseFloat(q.radius) : 5;
    return this.itemsService.findNearby(lat, lng, radius);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemsService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id') id: string, @Body() dto: UpdateItemDto) {
    return this.itemsService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(id);
  }
}
