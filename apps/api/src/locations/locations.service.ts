import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LocationsService {
  constructor(private prisma: PrismaService) {}

  async nearby(lat: number, lng: number, radiusKm: number) {
    // NOTE: For MVP, return all locations (no geo filtering)
    return this.prisma.partnerLocation.findMany();
  }

  async byId(id: string) {
    return this.prisma.partnerLocation.findUnique({ where: { id } });
  }

  async search(q: string) {
    return this.prisma.partnerLocation.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { address: { contains: q, mode: 'insensitive' } },
          { city: { contains: q, mode: 'insensitive' } }
        ]
      }
    });
  }
}