import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import request from "supertest";
import { loginDemoUser } from "./utils";

describe("Wallet e2e", () => {
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

  it("POST /api/v1/rewards/withdraw", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/rewards/withdraw")
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ amountPence: 100 });
    expect(res.status).toBe(201);
    expect(res.body.status).toMatch(/REQUESTED|PAID/);
  });
});