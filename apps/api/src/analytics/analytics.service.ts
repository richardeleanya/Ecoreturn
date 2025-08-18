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
      include: { product: true, campaign: true, partnerLocation: true },
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
      const budgetRemainingPence = Math.max(0, c.budgetPence - spend);
      const roiPct = c.budgetPence
        ? Math.min(100, Math.round((spend / c.budgetPence) * 100))
        : 0;
      return {
        id: c.id,
        name: c.name,
        returnsCount: campReturns.length,
        spendPence: spend,
        budgetPence: c.budgetPence,
        budgetRemainingPence,
        roiPct,
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

    // Top Products
    const productMap = new Map<
      string,
      { id: string; name: string; returnsCount: number; spendPence: number }
    >();
    returns.forEach((r) => {
      if (!r.product) return;
      if (!productMap.has(r.product.id)) {
        productMap.set(r.product.id, {
          id: r.product.id,
          name: r.product.name,
          returnsCount: 0,
          spendPence: 0,
        });
      }
      const p = productMap.get(r.product.id)!;
      p.returnsCount += 1;
      p.spendPence += r.rewardPence;
    });
    const topProducts = Array.from(productMap.values())
      .sort((a, b) =>
        b.returnsCount === a.returnsCount
          ? b.spendPence - a.spendPence
          : b.returnsCount - a.returnsCount
      )
      .slice(0, 10);

    // Top Locations
    const locationMap = new Map<
      string,
      { id: string; name: string; returnsCount: number; spendPence: number }
    >();
    returns.forEach((r) => {
      if (!r.partnerLocation) return;
      if (!locationMap.has(r.partnerLocation.id)) {
        locationMap.set(r.partnerLocation.id, {
          id: r.partnerLocation.id,
          name: r.partnerLocation.name,
          returnsCount: 0,
          spendPence: 0,
        });
      }
      const l = locationMap.get(r.partnerLocation.id)!;
      l.returnsCount += 1;
      l.spendPence += r.rewardPence;
    });
    const topLocations = Array.from(locationMap.values())
      .sort((a, b) =>
        b.returnsCount === a.returnsCount
          ? b.spendPence - a.spendPence
          : b.returnsCount - a.returnsCount
      )
      .slice(0, 10);

    // totalBudgetRemainingPence = sum of active campaign budgetRemainingPence
    const totalBudgetRemainingPence = campaignPerformance
      .filter((c) => c.budgetRemainingPence > 0)
      .reduce((sum, c) => sum + c.budgetRemainingPence, 0);

    return {
      kpi: { returnsCount, spendPence, avgRewardPence, totalBudgetRemainingPence },
      campaignPerformance,
      timeseries,
      topProducts,
      topLocations,
    };
  }
}