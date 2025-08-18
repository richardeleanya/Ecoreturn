import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { ScanModule } from './scan/scan.module';
import { ReturnsModule } from './returns/returns.module';
import { UploadsModule } from './uploads/uploads.module';
import { WalletModule } from './wallet/wallet.module';
import { QueuesModule } from './queues/queues.module';
import { LocationsModule } from './locations/locations.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { BrandsAdminModule } from './admin/brands.module';
import { LocationsAdminModule } from './admin/locations.module';
import { ProductsAdminModule } from './admin/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    ScanModule,
    ReturnsModule,
    UploadsModule,
    WalletModule,
    QueuesModule,
    LocationsModule,
    CampaignsModule,
    AnalyticsModule,
    BrandsAdminModule,
    LocationsAdminModule,
    ProductsAdminModule,
  ],
})
export class AppModule {}