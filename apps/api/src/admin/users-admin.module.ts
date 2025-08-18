import { Module } from "@nestjs/common";
import { UsersAdminService } from "./users-admin.service";
import { UsersAdminController } from "./users-admin.controller";
import { PrismaService } from "../prisma/prisma.service";

@Module({
  providers: [UsersAdminService, PrismaService],
  controllers: [UsersAdminController],
})
export class UsersAdminModule {}