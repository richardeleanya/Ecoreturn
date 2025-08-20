import { Module } from '@nestjs/common';
import { ScanController } from './scan.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  controllers: [ScanController],
})
export class ScanModule {}