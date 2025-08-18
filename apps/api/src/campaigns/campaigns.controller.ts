import { Controller, Post, Body, Get, Param, Req, UseGuards } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { JwtAuthGuard } from '../common/jwt-auth.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Campaigns')
@Controller('api/v1/campaigns')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CampaignsController {
  constructor(private readonly campaignsService: CampaignsService) {}

  @Post()
  @Roles('BRAND')
  async create(@Req() req: any, @Body() body: { name: string; startAt: string; endAt: string; rewardPerItem: number }) {
    const brandId = req.user.brandId;
    return this.campaignsService.create({
      brandId,
      name: body.name,
      startAt: new Date(body.startAt),
      endAt: new Date(body.endAt),
      rewardPerItem: body.rewardPerItem,
    });
  }

  @Get()
  @Roles('BRAND')
  async list(@Req() req: any) {
    const brandId = req.user.brandId;
    return this.campaignsService.list(brandId);
  }

  @Get(':id')
  @Roles('BRAND')
  async get(@Param('id') id: string) {
    return this.campaignsService.get(id);
  }
}