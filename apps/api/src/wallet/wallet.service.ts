import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class WalletService {
  constructor(
    private prisma: PrismaService,
    @InjectQueue('withdrawal') private queue: Queue,
  ) {}

  async getWallet(userId: string) {
    return this.prisma.wallet.findUnique({ where: { userId } });
  }

  async getTransactions(userId: string) {
    const wallet = await this.getWallet(userId);
    if (!wallet) throw new BadRequestException('Wallet not found');
    return this.prisma.transaction.findMany({ where: { walletId: wallet.id } });
  }

  async requestWithdrawal(userId: string, amountPence: number) {
    const wallet = await this.getWallet(userId);
    if (!wallet || wallet.balancePence < amountPence)
      throw new BadRequestException('Insufficient balance');
    const wr = await this.prisma.withdrawalRequest.create({
      data: {
        userId,
        amountPence,
        status: 'REQUESTED',
      },
    });
    await this.queue.add('withdrawal', { userId, amountPence, wrId: wr.id });
    return wr;
  }
}