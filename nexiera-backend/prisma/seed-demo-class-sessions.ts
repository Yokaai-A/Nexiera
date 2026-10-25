import "reflect-metadata";
import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { demoClassSessions } from "./demo-class-sessions.js";

const databaseHost = process.env.DATABASE_HOST || "localhost";
if (!["localhost", "127.0.0.1", "::1"].includes(databaseHost)) {
  throw new Error("Demo class session refresh only runs against a local database.");
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb({
    host: databaseHost,
    port: Number(process.env.DATABASE_PORT || 3306),
    user: process.env.DATABASE_USER || "nexiera",
    password: process.env.DATABASE_PASSWORD || "nexiera_local_password",
    database: process.env.DATABASE_NAME || "nexiera",
    connectionLimit: 2,
    allowPublicKeyRetrieval: true,
  }),
});

async function main() {
  for (const [slug, session] of Object.entries(demoClassSessions)) {
    const result = await prisma.class.updateMany({
      where: { slug },
      data: session,
    });
    if (result.count !== 1) throw new Error(`Expected one demo class for ${slug}, found ${result.count}.`);
  }
  console.log(`Updated demo schedule and material for ${Object.keys(demoClassSessions).length} classes.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => prisma.$disconnect());
