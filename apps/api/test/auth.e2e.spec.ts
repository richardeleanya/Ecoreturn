import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import request from "supertest";
import { loginDemoUser } from "./utils";

describe("Auth e2e", () => {
  let app: INestApplication;
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it("POST /api/v1/auth/login demo user", async () => {
    const res = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "demo@ecoreturn.com", password: "Passw0rd!" });
    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
  });

  it("GET /api/v1/auth/profile with Bearer token", async () => {
    const token = await loginDemoUser(app);
    const res = await request(app.getHttpServer())
      .get("/api/v1/auth/profile")
      .set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe("demo@ecoreturn.com");
  });
});