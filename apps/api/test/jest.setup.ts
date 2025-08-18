import { execSync } from "child_process";

beforeAll(async () => {
  execSync("pnpm --filter api prisma:generate", { stdio: "inherit" });
  execSync("pnpm --filter api db:migrate", { stdio: "inherit" });
  execSync("pnpm --filter api db:seed", { stdio: "inherit" });
});