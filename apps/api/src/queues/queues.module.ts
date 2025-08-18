import { Module } from '@nestjs/common';
import { WithdrawProcessor } from './withdraw.processor';

@Module({
  providers: [WithdrawProcessor],
  exports: [WithdrawProcessor],
})
export class QueuesModule {}