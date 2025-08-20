import { Process, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Processor('withdrawal')
@Injectable()
export class WithdrawProcessor {
  constructor(private prisma: PrismaService) {}

  @Process('withdrawal')
  async handleWithdraw(job: Job) {
    const { userId, amountPence, wrId } = job.data;
    // Simulate payout delay
    await new Promise((res) => setTimeout(res, 2000));
    // Update WithdrawalRequest to PAID
    await this.prisma.withdrawalRequest.update({
      where: { id: wrId },
      data: {
        status: 'PAID',
        stripeTransferId: process.env.STRIPE_SECRET_KEY ? 'test_transfer_id' : null,
      },
    });
    // Create DEBIT transaction
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (wallet) {
      await this.prisma.transaction.create({
        data: {
          walletId: wallet.id,
          type: 'DEBIT',
          amountPence,
          refType: 'WITHDRAWAL',
          refId: wrId,
        },
      });
      // Deduct from wallet
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: { balancePence: { decrement: amountPence } },
      });
    }
  }
}