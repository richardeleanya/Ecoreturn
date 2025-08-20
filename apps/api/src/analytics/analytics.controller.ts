import {
  Controller,
  Get,
  Query,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { AnalyticsService } from "./analytics.service";
import { Roles } from "../common/roles.decorator";
import { RolesGuard } from "../common/roles.guard";
import { JwtAuthGuard } from "../common/jwt-auth.guard";
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { Response } from "express";

function parseDate(str?: string): Date | undefined {
  if (!str) return undefined;
  const d = new Date(str);
  return isNaN(d.getTime()) ? undefined : d;
}

@ApiTags("Analytics")
@Controller("api/v1/analytics")
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  @Get("brand")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async brand(
    @Query("brandId") brandId?: string,
    @Query("days") daysStr?: string,
    @Query("start") startStr?: string,
    @Query("end") endStr?: string
  ) {
    const days = daysStr ? Number(daysStr) : undefined;
    const start = parseDate(startStr);
    const end = parseDate(endStr);
    return this.analytics.getBrandAnalytics(brandId, days, start, end);
  }

  @Get("brand/csv")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async brandCsv(
    @Res() res: Response,
    @Query("brandId") brandId?: string,
    @Query("days") daysStr?: string,
    @Query("start") startStr?: string,
    @Query("end") endStr?: string
  ) {
    const days = daysStr ? Number(daysStr) : undefined;
    const start = parseDate(startStr);
    const end = parseDate(endStr);
    const data = await this.analytics.getBrandAnalytics(brandId, days, start, end);
    let csv = "date,returnsCount,spendPence\n";
    for (const row of data.timeseries) {
      csv += `${row.date},${row.returnsCount},${row.spendPence}\n`;
    }
    csv += "\nCAMPAIGN PERFORMANCE\n";
    csv += "id,name,returnsCount,spendPence,budgetPence,budgetRemainingPence,roiPct\n";
    for (const c of data.campaignPerformance) {
      csv += `${c.id},${c.name},${c.returnsCount},${c.spendPence},${c.budgetPence},${c.budgetRemainingPence},${c.roiPct}\n`;
    }
    res.header("Content-Type", "text/csv");
    res.attachment("brand-analytics.csv");
    return res.send(csv);
  }

  @Get("admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  async admin(
    @Query("days") daysStr?: string,
    @Query("start") startStr?: string,
    @Query("end") endStr?: string
  ) {
    const days = daysStr ? Number(daysStr) : 14;
    const start = parseDate(startStr);
    const end = parseDate(endStr);
    return this.analytics.getAdminAnalytics(days, start, end);
  }

  @Get("admin/csv")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles("ADMIN")
  @ApiBearerAuth()
  async adminCsv(
    @Res() res: Response,
    @Query("days") daysStr?: string,
    @Query("start") startStr?: string,
    @Query("end") endStr?: string
  ) {
    const days = daysStr ? Number(daysStr) : 14;
    const start = parseDate(startStr);
    const end = parseDate(endStr);
    const data = await this.analytics.getAdminAnalytics(days, start, end);
    let csv = "USERS,BRANDS,PRODUCTS,LOCATIONS,RETURNS,SPENDPENCE\n";
    csv += `${data.totals.users},${data.totals.brands},${data.totals.products},${data.totals.locations},${data.totals.returnsCount},${data.totals.spendPence}\n\n`;
    csv += "date,returnsCount,spendPence\n";
    for (const row of data.timeseries) {
      csv += `${row.date},${row.returnsCount},${row.spendPence}\n`;
    }
    res.header("Content-Type", "text/csv");
    res.attachment("admin-analytics.csv");
    return res.send(csv);
  }
}