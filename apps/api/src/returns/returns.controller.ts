import { Controller, Post, Body, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Returns')
@Controller('api/v1/returns')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReturnsController {
  constructor(private readonly returnsService: ReturnsService) {}

  @Post('create')
  async create(@Body() body: { barcode: string; photoId: string; gpsLat: number; gpsLng: number; deviceId: string }, @Req() req: any) {
    return this.returnsService.createReturn({
      userId: req.user.userId,
      ...body,
    });
  }

  @Get('history')
  async history(@Req() req: any) {
    return this.returnsService.history(req.user.userId);
  }

  @Get(':id/status')
  async status(@Param('id') id: string) {
    return this.returnsService.getStatus(id);
  }
}