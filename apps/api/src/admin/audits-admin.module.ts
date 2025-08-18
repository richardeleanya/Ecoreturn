import { Module } from "@nestjs/common";
import { AuditsAdminService } from "./audits-admin.service";
import { AuditsAdminController } from "./audits-admin.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [AuditsAdminService, PrismaService],
  controllers: [AuditsAdminController],
})
export class AuditsAdminModule {}