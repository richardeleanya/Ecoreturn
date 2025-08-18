import request from "supertest";
import { INestApplication } from "@nestjs/common";

export async function loginDemoUser(app: INestApplication) {
  const res = await request(app.getHttpServer())
    .post("/api/v1/auth/login")
    .send({ email: "demo@ecoreturn.com", password: "Passw0rd!" });
  return res.body.accessToken as string;
}