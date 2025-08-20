import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Wallet')
@Controller('api/v1/rewards')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  async getBalance(@Req() req: any) {
    return this.walletService.getBalance(req.user.userId);
  }

  @Get('history')
  async getHistory(@Req() req: any) {
    // Return ordered transactions
    const txs = await this.walletService.getTransactions(req.user.userId);
    return txs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  @Post('withdraw')
  async withdraw(@Req() req: any, @Body('amountPence') amountPence: number) {
    return this.walletService.withdraw(req.user.userId, amountPence);
  }

  @Get('challenges')
  async getChallenges() {
    // Mock static challenges
    return [
      { id: 1, title: "Return 10 bottles this week", reward: 200 },
      { id: 2, title: "Refer a friend", reward: 500 }
    ];
  }
}