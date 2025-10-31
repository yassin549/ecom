import "dotenv/config";

// Load .env.local if it exists
require("dotenv").config({ path: ".env.local", override: true });

// Configure Prisma (replaces deprecated package.json#prisma config)
export default {
	seed: "tsx prisma/seed.ts",
};
