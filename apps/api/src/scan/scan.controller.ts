import { Controller, Post, Body } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Scan')
@Controller('api/v1/scan')
export class ScanController {
  constructor(private readonly productsService: ProductsService) {}

  @Post('validate')
  async validate(@Body() body: { barcode: string }) {
    const product = await this.productsService.findByBarcode(body.barcode);
    if (!product) {
      return { eligible: false, reason: 'Not found' };
    }
    // For MVP, return static eligibility and dummy reward
    return {
      eligible: true,
      rewardPence: 100,
      product,
    };
  }
}