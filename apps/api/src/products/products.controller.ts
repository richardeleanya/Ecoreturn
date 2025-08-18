import { Controller, Get, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('api/v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async findAll() {
    return this.productsService.findAll();
  }

  @Get('by-barcode')
  async findByBarcode(@Query('barcode') barcode: string) {
    return this.productsService.findByBarcode(barcode);
  }
}