import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import request from "supertest";
import { loginDemoUser } from "./utils";
import * as fs from "fs";
import * as path from "path";

describe("Returns e2e", () => {
  let app: INestApplication;
  let accessToken: string;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
    accessToken = await loginDemoUser(app);
  });

  it("POST /api/v1/uploads/photos and create return", async () => {
    const testImage = Buffer.from([0xff, 0xd8, 0xff, 0xd9]);
    const photoRes = await request(app.getHttpServer())
      .post("/api/v1/uploads/photos")
      .set("Authorization", `Bearer ${accessToken}`)
      .attach("photo", testImage, "test.jpg");
    expect(photoRes.body.id).toBeDefined();

    const createRes = await request(app.getHttpServer())
      .post("/api/v1/returns/create")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({
        barcode: "1000000000011",
        photoId: photoRes.body.id,
        gpsLat: 51.5,
        gpsLng: -0.09,
        deviceId: "test-device",
      });
    expect(createRes.body.id).toBeDefined();
    expect(createRes.body.status).toMatch(/APPROVED|PENDING/);
  });

  it("GET /api/v1/rewards/balance shows increased balance", async () => {
    const res = await request(app.getHttpServer())
      .get("/api/v1/rewards/balance")
      .set("Authorization", `Bearer ${accessToken}`);
    expect(res.status).toBe(200);
    expect(res.body.balancePence).toBeGreaterThanOrEqual(0);
  });
});