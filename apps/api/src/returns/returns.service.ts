import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { fraudScoreReturn } from './fraud.util';

@Injectable()
export class ReturnsService {
  constructor(private prisma: PrismaService) {}

  async createReturn(data: {
    userId: string;
    barcode: string;
    photoId: string;
    gpsLat: number;
    gpsLng: number;
    deviceId: string;
  }) {
    const product = await this.prisma.product.findUnique({ where: { barcode: data.barcode } });
    if (!product) throw new BadRequestException('Product not found');
    // Fraud scoring
    const recentReturns = await this.prisma.return.findMany({
      where: { userId: data.userId },
      orderBy: { createdAt: 'desc' },
      take: 5,
    });
    const { score, review } = fraudScoreReturn(recentReturns, data);
    // For MVP, auto-approve if clean
    const status = score < 50 ? 'APPROVED' : 'PENDING';
    const now = new Date();
    const ret = await this.prisma.return.create({
      data: {
        userId: data.userId,
        productId: product.id,
        status,
        rewardPence: 100,
        scannedAt: now,
        gpsLat: data.gpsLat,
        gpsLng: data.gpsLng,
        deviceId: data.deviceId,
        photoId: data.photoId,
        fraudReview: review,
        fraudScore: score,
        createdAt: now,
        updatedAt: now,
      },
    });
    if (status === 'APPROVED') {
      // Credit wallet
      let wallet = await this.prisma.wallet.findUnique({ where: { userId: data.userId } });
      if (!wallet) {
        wallet = await this.prisma.wallet.create({ data: { userId: data.userId } });
      }
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balancePence: { increment: ret.rewardPence },
          transactions: {
            create: {
              type: 'CREDIT',
              amountPence: ret.rewardPence,
              refType: 'RETURN',
              refId: ret.id,
            },
          },
        },
      });
    }
    return ret;
  }

  async history(userId: string) {
    return this.prisma.return.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
  }

  async getStatus(id: string) {
    return this.prisma.return.findUnique({ where: { id } });
  }
}