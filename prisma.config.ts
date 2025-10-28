import "dotenv/config";

// Load .env.local if it exists
require("dotenv").config({ path: ".env.local", override: true });

// Export empty config to use schema.prisma datasource
export default {};
