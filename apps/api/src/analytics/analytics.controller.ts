import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";

@ApiTags("Analytics")
@Controller("api/v1/analytics")
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get("brand")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async brand(
    @Query("brandId") brandId?: string,
    @Query("days") daysStr?: string
  ) {
    const days = daysStr ? Number(daysStr) : 14;
    return this.analytics.getBrandAnalytics(brandId, days);
  }

  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  async admin(@Query("days") daysStr?: string) {
    const days = daysStr ? Number(daysStr) : 14;
    return this.analytics.getAdminAnalytics(days);
  }
}