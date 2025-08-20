import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  async create(data: { brandId: string; name: string; startAt: Date; endAt: Date; rewardPerItem: number }) {
    return this.prisma.campaign.create({ data });
  }

  async list(brandId: string) {
    return this.prisma.campaign.findMany({ where: { brandId } });
  }

  async get(id: string) {
    return this.prisma.campaign.findUnique({ where: { id } });
  }
}