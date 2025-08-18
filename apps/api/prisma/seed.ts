import { PrismaClient, AuthProvider, UserRole, UserStatus, PackageType, CampaignStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Create BRAND
  const brand = await prisma.brand.create({
    data: {
      name: "EcoBrand",
      logoUrl: "https://via.placeholder.com/128",
      description: "Sustainable brand for testing.",
      website: "https://ecobrand.com",
    },
  });

  // 2 Partner Locations
  const loc1 = await prisma.partnerLocation.create({
    data: {
      brandId: brand.id,
      name: "EcoReturn London",
      address: "123 Main St",
      city: "London",
      postcode: "EC1A 2BC",
      lat: 51.515,
      lng: -0.09,
      contactEmail: "london@ecobrand.com",
      status: UserStatus.ACTIVE,
    },
  });
  const loc2 = await prisma.partnerLocation.create({
    data: {
      brandId: brand.id,
      name: "EcoReturn Manchester",
      address: "456 Market St",
      city: "Manchester",
      postcode: "M1 2AB",
      lat: 53.48,
      lng: -2.24,
      contactEmail: "manchester@ecobrand.com",
      status: UserStatus.ACTIVE,
    },
  });

  // 5 Products with different barcodes & package types
  const products = await Promise.all([
    prisma.product.create({
      data: {
        brandId: brand.id,
        name: "Eco Bottle",
        barcode: "1000000000011",
        sku: "ECOBOTTLE",
        packageType: PackageType.PLASTIC,
      },
    }),
    prisma.product.create({
      data: {
        brandId: brand.id,
        name: "Eco Can",
        barcode: "1000000000028",
        sku: "ECOCAN",
        packageType: PackageType.ALUMINUM,
      },
    }),
    prisma.product.create({
      data: {
        brandId: brand.id,
        name: "Eco Jar",
        barcode: "1000000000035",
        sku: "ECOJAR",
        packageType: PackageType.GLASS,
      },
    }),
    prisma.product.create({
      data: {
        brandId: brand.id,
        name: "Eco Box",
        barcode: "1000000000042",
        sku: "ECOBOX",
        packageType: PackageType.CARDBOARD,
      },
    }),
    prisma.product.create({
      data: {
        brandId: brand.id,
        name: "Eco Pack",
        barcode: "1000000000059",
        sku: "ECOPACK",
        packageType: PackageType.COMPOSITE,
      },
    }),
  ]);

  // 1 ACTIVE Campaign
  const now = new Date();
  const in60 = new Date(now.getTime() + 60 * 24 * 3600 * 1000);
  const campaign = await prisma.campaign.create({
    data: {
      brandId: brand.id,
      name: "Launch Promo",
      startAt: now,
      endAt: in60,
      rewardPerItem: 20.0,
      status: CampaignStatus.ACTIVE,
      budgetPence: 1000000,
    },
  });

  // Consumer user + wallet
  const passwordHash = await bcrypt.hash("Passw0rd!", 10);
  const user = await prisma.user.create({
    data: {
      email: "demo@ecoreturn.com",
      provider: AuthProvider.EMAIL,
      role: UserRole.CONSUMER,
      status: UserStatus.ACTIVE,
      passwordHash,
      firstName: "Demo",
      lastName: "User",
    },
  });
  await prisma.wallet.create({
    data: {
      userId: user.id,
      balancePence: 0,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });