import "dotenv/config";

// Load .env.local if it exists
require("dotenv").config({ path: ".env.local", override: true });

// Minimal Prisma config; keep defaults and rely on schema.prisma datasource
export default {};
