import { Process, Processor } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

@Processor('withdrawal')
export class WithdrawProcessor {
  constructor(private prisma: PrismaService) {}

  @Process()
  async handle(job: Job) {
    const { userId, amountPence, wrId } = job.data;
    // Simulate delay
    await new Promise((r) => setTimeout(r, 2000));
    // Mark as PAID, debit wallet, add transaction
    await this.prisma.withdrawalRequest.update({
      where: { id: wrId },
      data: { status: 'PAID', stripeTransferId: 'test_transfer_id' },
    });
    const wallet = await this.prisma.wallet.findUnique({ where: { userId } });
    if (wallet) {
      await this.prisma.wallet.update({
        where: { id: wallet.id },
        data: {
          balancePence: { decrement: amountPence },
          transactions: {
            create: {
              type: 'DEBIT',
              amountPence,
              refType: 'WITHDRAWAL',
              refId: wrId,
            },
          },
        },
      });
    }
  }
}