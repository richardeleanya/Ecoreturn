import { Module } from '@nestjs/common';
import { ReturnsService } from './returns.service';
import { ReturnsController } from './returns.controller';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [ProductsModule],
  providers: [ReturnsService],
  controllers: [ReturnsController],
  exports: [ReturnsService],
})
export class ReturnsModule {}