import "reflect-metadata";
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { demoClassSessions } from "./demo-class-sessions.js";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl || !["localhost", "127.0.0.1", "::1"].includes(new URL(databaseUrl).hostname)) {
  throw new Error("Demo class session refresh only runs against a local database.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

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
