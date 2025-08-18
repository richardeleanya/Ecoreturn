import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WithdrawProcessor } from './withdraw.processor';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        url: process.env.REDIS_URL || 'redis://localhost:6379',
      },
    }),
    BullModule.registerQueue({ name: 'withdrawal' }),
  ],
  providers: [WithdrawProcessor],
  exports: [BullModule],
})
export class QueuesModule {}