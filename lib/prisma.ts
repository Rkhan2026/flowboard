import { PrismaClient } from "@prisma/client";

// Declare the global type for Prisma on the NodeJS Global object
/* eslint-disable no-var */
declare global {
  // Prevent duplicate variable declarations
  // 'var' allows reassignment but prevents type conflicts during hot reload
  var prisma: PrismaClient | undefined;
}

// Create a new PrismaClient or reuse existing one from global
export const db: PrismaClient = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}

// globalThis.prisma: This global variable ensures that the Prisma client instance is
// reused across hot reloads during development. Without this, each time your application
// reloads, a new instance of the Prisma client would be created, potentially leading
// to connection issues.