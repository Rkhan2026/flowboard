/**
 * lib/prisma.js
 *
 * Purpose:
 * This file sets up and exports a single Prisma client instance (`db`) to be used across your app.
 * It ensures that during development, the Prisma client is not recreated on every reload,
 * which helps avoid issues with too many database connections.
 *
 * How to use:
 * Import `db` from this file anywhere you need to interact with your database using Prisma.
 *
 * Example:
 * import { db } from "@/lib/prisma";
 */

import { PrismaClient } from "@prisma/client";

// Create or reuse an existing Prisma client instance
export const db = globalThis.prisma || new PrismaClient();

// Store the instance globally in development to avoid multiple connections
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = db;
}