import {
  Controller,
  Get,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuditsAdminService } from "./audits-admin.service";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Admin Audits")
@Controller("api/v1/admin/audits")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
@ApiBearerAuth()
export class AuditsAdminController {
  constructor(private readonly audits: AuditsAdminService) {}

  @Get()
  async list(
    @Query("actorId") actorId?: string,
    @Query("action") action?: string,
    @Query("start") start?: string,
    @Query("end") end?: string,
    @Query("page") pageStr?: string,
    @Query("pageSize") pageSizeStr?: string
  ) {
    const page = pageStr ? Number(pageStr) : 1;
    const pageSize = pageSizeStr ? Number(pageSizeStr) : 20;
    return this.audits.list({ actorId, action, start, end, page, pageSize });
  }
}