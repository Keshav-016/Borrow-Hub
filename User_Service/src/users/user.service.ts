import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto, UpdateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Env from 'src/utils/Env';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findFirst({
      where: { email: { equals: createUserDto.email, mode: 'insensitive' } },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
        phone: createUserDto.phone,
        address: createUserDto.address,
        latitude: createUserDto.latitude,
        longitude: createUserDto.longitude,
        reputation_score: createUserDto.reputation_score,
      },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new NotFoundException('Email and password are required');
    }
    const user = await this.prisma.user.findFirst({ where: { email:{equals:email, mode:'insensitive'} } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new NotFoundException('Invalid credentials');
    }
    const token = jwt.sign({ userId: user.id, role: user.role }, Env.JWT_SECRET, { expiresIn: Number(Env.JWT_TTL) });
    return { user:user.name, token };
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findFirst({ where: { email:{equals:email, mode:'insensitive'} } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const data: any = {};
    if (updateUserDto.name) data.name = updateUserDto.name;
    if (updateUserDto.phone) data.phone = updateUserDto.phone;
    if (updateUserDto.address) data.address = updateUserDto.address;
    if (updateUserDto.latitude) data.latitude = updateUserDto.latitude;
    if (updateUserDto.longitude) data.longitude = updateUserDto.longitude;
    if (updateUserDto.reputation_score) data.reputation_score = updateUserDto.reputation_score;
    if (updateUserDto.role) data.role = updateUserDto.role;
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    const user = await this.prisma.user.update({ where: { id }, data });
    return user;
  }

  async remove(id: string) {
    await this.prisma.user.delete({ where: { id } });
  }
}