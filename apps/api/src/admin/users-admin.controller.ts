import {
  Controller,
  Get,
  Put,
  Param,
  Body,
  Req,
  UseGuards,
} from "@nestjs/common";
import { UsersAdminService } from "./users-admin.service";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { UserRole, UserStatus } from "@prisma/client";

class UpdateRoleDto {
  role: UserRole;
}
class UpdateStatusDto {
  status: UserStatus;
}

@ApiTags("Admin Users")
@Controller("api/v1/admin/users")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiBearerAuth()
export class UsersAdminController {
  constructor(private readonly usersAdmin: UsersAdminService) {}

  @Get()
  async list() {
    return this.usersAdmin.list();
  }

  @Put(":id/role")
  async updateRole(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateRoleDto) {
    return this.usersAdmin.updateRole(req.user.userId, id, dto.role);
  }

  @Put(":id/status")
  async updateStatus(@Req() req: any, @Param("id") id: string, @Body() dto: UpdateStatusDto) {
    return this.usersAdmin.updateStatus(req.user.userId, id, dto.status);
  }
}