import { Test, TestingModule } from "@nestjs/testing";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../src/app.module";
import request from "supertest";

describe("Admin e2e", () => {
  let app: INestApplication;
  let adminToken: string;
  let demoUser: any;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();

    const loginRes = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "demo_admin@ecoreturn.com", password: "Passw0rd!" });
    expect(loginRes.status).toBe(201);
    adminToken = loginRes.body.accessToken;

    const usersRes = await request(app.getHttpServer())
      .get("/api/v1/admin/users")
      .set("Authorization", `Bearer ${adminToken}`);
    demoUser = usersRes.body.find((u: any) => u.email === "demo@ecoreturn.com");
    expect(demoUser).toBeTruthy();
  });

  it("should update demo user role and status and create audits", async () => {
    // Update role
    const roleRes = await request(app.getHttpServer())
      .put(`/api/v1/admin/users/${demoUser.id}/role`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ role: "PARTNER" });
    expect(roleRes.status).toBe(200);
    expect(roleRes.body.role).toBe("PARTNER");

    // Update status
    const statusRes = await request(app.getHttpServer())
      .put(`/api/v1/admin/users/${demoUser.id}/status`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ status: "SUSPENDED" });
    expect(statusRes.status).toBe(200);
    expect(statusRes.body.status).toBe("SUSPENDED");

    // Get audits
    const auditsRes = await request(app.getHttpServer())
      .get("/api/v1/admin/audits")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(auditsRes.status).toBe(200);
    expect(Array.isArray(auditsRes.body.items)).toBe(true);
    expect(auditsRes.body.items.some((a: any) => a.action === "USER_ROLE_UPDATE")).toBe(true);
    expect(auditsRes.body.items.some((a: any) => a.action === "USER_STATUS_UPDATE")).toBe(true);
  });
});