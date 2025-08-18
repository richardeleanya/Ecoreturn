import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WalletService {
  constructor(private prisma: PrismaService) {}

  async getBalance(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return { balancePence: wallet.balancePence };
  }

  async getHistory(userId: string) {
    const wallet = await this.prisma.wallet.findUnique({ where: { userId }, include: { transactions: true } });
    if (!wallet) throw new NotFoundException('Wallet not found');
    return wallet.transactions;
  }

  async withdraw(userId: string, amountPence: number) {
    // Create WithdrawalRequest and enqueue job
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (!wallet || wallet.balancePence < amountPence) throw new NotFoundException('Insufficient balance');
    const wr = await this.prisma.withdrawalRequest.create({
      data: {
        userId,
        amountPence,
        status: 'REQUESTED'
      }
    });
    // TODO: Enqueue BullMQ job
    return wr;
  }
}