import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AuditsAdminService {
  constructor(private prisma: PrismaService) {}

  async list({
    actorId,
    action,
    start,
    end,
    page = 1,
    pageSize = 20,
  }: {
    actorId?: string;
    action?: string;
    start?: string;
    end?: string;
    page?: number;
    pageSize?: number;
  }) {
    const where: any = {};
    if (actorId) where.actorUserId = actorId;
    if (action) where.action = action;
    if (start || end) {
      where.createdAt = {};
      if (start) where.createdAt.gte = new Date(start);
      if (end) where.createdAt.lte = new Date(end);
    }
    const total = await this.prisma.adminAudit.count({ where });
    const items = await this.prisma.adminAudit.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    return { items, page, pageSize, total };
  }
}