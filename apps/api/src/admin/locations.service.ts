import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  list() {
    return this.prisma.partnerLocation.findMany();
  }
  create(data: any) {
    return this.prisma.partnerLocation.create({ data });
  }
  update(id: string, data: any) {
    return this.prisma.partnerLocation.update({ where: { id }, data });
  }
  remove(id: string) {
    return this.prisma.partnerLocation.delete({ where: { id } });
  }
}