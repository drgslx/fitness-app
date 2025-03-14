import { PrismaClient } from "@prisma/client";

// global.prisma = undefined;

// const client = global.prisma || new PrismaClient();
// if (process.env.NODE_ENV !== "production") global.prisma = client;

// module.exports = client;

// const { PrismaClient } = require("@prisma/client");

const globalForPrisma = globalThis || window || {};

if (!globalForPrisma.prisma) {
	globalForPrisma.prisma = new PrismaClient();
}

const prisma = globalForPrisma.prisma;

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

// module.exports = prisma;

export default prisma;
