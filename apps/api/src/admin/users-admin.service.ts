import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole, UserStatus } from "@prisma/client";

@Injectable()
export class UsersAdminService {
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
      },
    });
  }

  async updateRole(actorUserId: string, id: string, role: UserRole) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    const updated = await this.prisma.user.update({
      where: { id },
      data: { role },
    });
    await this.prisma.adminAudit.create({
      data: {
        actorUserId,
        action: "USER_ROLE_UPDATE",
        meta: {
          targetUserId: id,
          previous: { role: user.role },
          next: { role },
        },
      },
    });
    return updated;
  }

  async updateStatus(actorUserId: string, id: string, status: UserStatus) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException("User not found");
    const updated = await this.prisma.user.update({
      where: { id },
      data: { status },
    });
    await this.prisma.adminAudit.create({
      data: {
        actorUserId,
        action: "USER_STATUS_UPDATE",
        meta: {
          targetUserId: id,
          previous: { status: user.status },
          next: { status },
        },
      },
    });
    return updated;
  }
}