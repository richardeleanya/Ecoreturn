import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}
  async findAll() {
    return this.prisma.product.findMany();
  }
  async findByBarcode(barcode: string) {
    return this.prisma.product.findUnique({ where: { barcode } });
  }
}