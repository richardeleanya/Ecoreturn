import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { subDays, format } from "date-fns";

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getBrandAnalytics(brandId?: string, days = 14) {
    let brand = brandId
      ? await this.prisma.brand.findUnique({ where: { id: brandId } })
      : await this.prisma.brand.findFirst();
    if (!brand) throw new Error("Brand not found");

    const start = subDays(new Date(), days);
    const returns = await this.prisma.return.findMany({
      where: {
        product: { brandId: brand.id },
        createdAt: { gte: start },
      },
      include: { product: true, campaign: true },
    });

    const campaigns = await this.prisma.campaign.findMany({
      where: { brandId: brand.id },
    });

    // KPI
    const spendPence = returns.reduce((s, r) => s + r.rewardPence, 0);
    const returnsCount = returns.length;
    const avgRewardPence = returnsCount ? Math.round(spendPence / returnsCount) : 0;

    // Campaign performance
    const campaignPerformance = campaigns.map((c) => {
      const campReturns = returns.filter((r) => r.campaignId === c.id);
      const spend = campReturns.reduce((s, r) => s + r.rewardPence, 0);
      const spendPct = c.budgetPence
        ? Math.min(100, Math.round((spend / c.budgetPence) * 100))
        : 0;
      return {
        id: c.id,
        name: c.name,
        returnsCount: campReturns.length,
        spendPence: spend,
        budgetPence: c.budgetPence,
        spendPct,
      };
    });

    // Timeseries
    const dateMap = new Map<string, { returnsCount: number; spendPence: number }>();
    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - i - 1), "yyyy-MM-dd");
      dateMap.set(date, { returnsCount: 0, spendPence: 0 });
    }
    returns.forEach((r) => {
      const date = format(r.createdAt, "yyyy-MM-dd");
      if (dateMap.has(date)) {
        const v = dateMap.get(date)!;
        v.returnsCount += 1;
        v.spendPence += r.rewardPence;
      }
    });
    const timeseries = Array.from(dateMap.entries()).map(([date, v]) => ({
      date,
      ...v,
    }));

    return {
      kpi: { returnsCount, spendPence, avgRewardPence },
      campaignPerformance,
      timeseries,
    };
  }

  async getAdminAnalytics(days = 14) {
    const users = await this.prisma.user.count();
    const brands = await this.prisma.brand.count();
    const products = await this.prisma.product.count();
    const locations = await this.prisma.partnerLocation.count();
    const start = subDays(new Date(), days);
    const returns = await this.prisma.return.findMany({
      where: { createdAt: { gte: start } },
    });
    const spendPence = returns.reduce((s, r) => s + r.rewardPence, 0);

    // Timeseries
    const dateMap = new Map<string, { returnsCount: number; spendPence: number }>();
    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - i - 1), "yyyy-MM-dd");
      dateMap.set(date, { returnsCount: 0, spendPence: 0 });
    }
    returns.forEach((r) => {
      const date = format(r.createdAt, "yyyy-MM-dd");
      if (dateMap.has(date)) {
        const v = dateMap.get(date)!;
        v.returnsCount += 1;
        v.spendPence += r.rewardPence;
      }
    });
    const timeseries = Array.from(dateMap.entries()).map(([date, v]) => ({
      date,
      ...v,
    }));

    return {
      totals: {
        users,
        brands,
        products,
        locations,
        returnsCount: returns.length,
        spendPence,
      },
      timeseries,
    };
  }
}