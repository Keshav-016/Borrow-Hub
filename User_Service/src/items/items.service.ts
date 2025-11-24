import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateItemDto) {
    const { imageUrls, availability, ...rest } = dto as any;

    const data: any = { ...rest };

    if (imageUrls?.length) {
      data.images = { create: imageUrls.map((url: string) => ({ imageUrl: url })) };
    }

    if (availability?.length) {
      data.availability = { create: availability.map((a: any) => ({ startTime: new Date(a.startTime), endTime: new Date(a.endTime), isBooked: a.isBooked ?? false })) };
    }

    return this.prisma.item.create({ data, include: { images: true, availability: true, category: true } });
  }

  async findAll() {
    return this.prisma.item.findMany({ include: { images: true, availability: true, category: true }, orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string) {
    const item = await this.prisma.item.findUnique({ where: { id }, include: { images: true, availability: true, category: true } });
    if (!item) throw new NotFoundException('Item not found');
    return item;
  }

  async update(id: string, dto: UpdateItemDto) {
    const { imageUrls, availability, ...rest } = dto as any;

    await this.findOne(id);

    const updated = await this.prisma.item.update({ where: { id }, data: rest, include: { images: true, availability: true, category: true } });

    if (availability) {
      await this.prisma.itemAvailability.deleteMany({ where: { itemId: id } });
      if (availability.length) {
        await this.prisma.itemAvailability.createMany({ data: availability.map((a: any) => ({ itemId: id, startTime: new Date(a.startTime), endTime: new Date(a.endTime), isBooked: a.isBooked ?? false })) });
      }
    }

    if (imageUrls && imageUrls.length) {
      await this.prisma.itemImage.createMany({ data: imageUrls.map((url: string) => ({ itemId: id, imageUrl: url })) });
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.item.delete({ where: { id } });
  }

  // Haversine: returns items within radiusKm (default 5km), sorted by distance (km)
  async findNearby(lat: number, lng: number, radiusKm = 5) {
    const items = await this.prisma.item.findMany({ where: { latitude: { not: null }, longitude: { not: null } }, include: { images: true, availability: true, category: true } });

    const haversine = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const toRad = (deg: number) => (deg * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    return items
      .map((it) => ({ ...it, distanceKm: haversine(lat, lng, it.latitude!, it.longitude!) }))
      .filter((it) => it.distanceKm <= radiusKm)
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }
}
