import "dotenv/config";
import { defineConfig } from "prisma/config";
import config from "./src/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "npx tsx prisma/seed.ts",
  },
  datasource: {
    url: config.database_url,
  },
});
