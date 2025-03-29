/**
 * schemas/validation.js
 *
 * Purpose:
 * Defines validation rules for Project, Sprint, and Issue forms
 * using Zod. These schemas help ensure form inputs are valid
 * before they’re sent to the backend.
 */

import { z } from "zod"; // Zod is a TypeScript-first schema validation library

// ----------------------------
// Project Form Validation
// ----------------------------
export const projectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required") // Required field
    .max(100, "Project name must be 100 characters or less"), // Max length constraint

  key: z
    .string()
    .min(2, "Project key must be at least 2 characters") // E.g., "FB"
    .max(10, "Project key must be 10 characters or less") // E.g., "FLOWBOARD"
    .toUpperCase(), // Force all-uppercase keys

  description: z
    .string()
    .max(500, "Description must be 500 characters or less") // Optional long text
    .optional(), // This field is not required
});

// ----------------------------
// Sprint Form Validation
// ----------------------------
export const sprintSchema = z.object({
  name: z
    .string()
    .min(1, "Sprint name is required"), // Sprint must have a name

  startDate: z.date(), // Must be a valid Date object
  endDate: z.date(),   // Must be a valid Date object
});

// ----------------------------
// Issue Form Validation
// ----------------------------
export const issueSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required"), // Required issue title

  assigneeId: z
    .string()
    .cuid("Please select assignee"), // Assignee must be a valid CUID (Clerk user IDs use CUID)

  description: z
    .string()
    .optional(), // Description is not required

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"]), // Only one of these four priority values is allowed
});