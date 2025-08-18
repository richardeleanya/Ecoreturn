import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { ProductsModule } from "./products/products.module";
import { ScanModule } from "./scan/scan.module";
import { ReturnsModule } from "./returns/returns.module";
import { UploadsModule } from "./uploads/uploads.module";
import { WalletModule } from "./wallet/wallet.module";
import { LocationsModule } from "./locations/locations.module";
import { CampaignsModule } from "./campaigns/campaigns.module";
import { QueuesModule } from "./queues/queues.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";

const serveStatic =
  process.env.NODE_ENV !== "production"
    ? [
        ServeStaticModule.forRoot({
          rootPath: join(process.cwd(), "uploads"),
          serveRoot: "/uploads",
        }),
      ]
    : [];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ...serveStatic,
    PrismaModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    ScanModule,
    ReturnsModule,
    UploadsModule,
    WalletModule,
    LocationsModule,
    CampaignsModule,
    QueuesModule,
  ],
})
export class AppModule {}