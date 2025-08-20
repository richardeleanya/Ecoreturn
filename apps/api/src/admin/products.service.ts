import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.product.findMany();
  }
  create(data: any) {
    return this.prisma.product.create({ data });
  }
  update(id: string, data: any) {
    return this.prisma.product.update({ where: { id }, data });
  }
  remove(id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}