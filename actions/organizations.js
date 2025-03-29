"use server";

/**
 * actions/organizations.js
 *
 * Purpose:
 * This file includes all server-side functions related to managing organizations
 * in a Clerk + Prisma + Next.js app.
 *
 * What it does:
 * - Fetches a Clerk organization based on slug
 * - Gets all projects under an organization
 * - Gets issues assigned to or reported by a user
 * - Lists all users within an organization
 *
 * Usage:
 * These functions are meant to be used in server components, actions, or routes
 * wherever you need secure access to organization-related data.
 */

import { db } from "@/lib/prisma"; // Prisma client for database access
import { auth, clerkClient } from "@clerk/nextjs/server"; // Clerk auth + backend API access

// -----------------------------------------------------
// Get a specific organization by slug (like "team-x")
// and verify the current user is a member of that org
// -----------------------------------------------------
export async function getOrganization(slug) {
  const { userId } = await auth(); // Get the signed-in user's ID

  if (!userId) {
    throw new Error("Unauthorized"); // Block if not signed in
  }

  // Find the user in your own database (by Clerk ID)
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found"); // If not found in DB
  }

  // Use Clerk's backend client to get organization by slug
  const client = await clerkClient();
  const organization = await client.organizations.getOrganization({ slug });

  if (!organization) {
    return null; // Org not found
  }

  // Get all members of that organization
  const { data: membership } =
    await client.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  // Check if the current user is in that list
  const userMembership = membership.find(
    (member) => member.publicUserData?.userId === userId
  );

  if (!userMembership) {
    return null; // User not part of the org
  }

  return organization; // Return the org if valid and user is a member
}

// -----------------------------------------------------
// Get all projects that belong to an organization
// -----------------------------------------------------
export async function getProjects(orgId) {
  const { userId } = await auth(); // Check who is logged in

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Check the user exists in your DB
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get all projects tied to this organization
  const projects = await db.project.findMany({
    where: { organizationId: orgId },
    orderBy: { createdAt: "desc" }, // Most recent first
  });

  return projects;
}

// -----------------------------------------------------
// Get all issues created by or assigned to a user
// within their current organization
// -----------------------------------------------------
export async function getUserIssues(userId) {
  const { orgId } = await auth(); // Get the current org ID from Clerk

  if (!userId || !orgId) {
    throw new Error("No user id or organization id found");
  }

  // Get the user record from your DB
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Find all issues where user is either the assignee or the reporter
  // Also make sure the issue belongs to the same org
  const issues = await db.issue.findMany({
    where: {
      OR: [{ assigneeId: user.id }, { reporterId: user.id }],
      project: {
        organizationId: orgId,
      },
    },
    include: {
      project: true,   // Include project details
      assignee: true,  // Include assignee details
      reporter: true,  // Include reporter details
    },
    orderBy: { updatedAt: "desc" }, // Sort by latest updates
  });

  return issues;
}

// -----------------------------------------------------
// Get all users that are part of a specific organization
// by checking Clerk membership and mapping to local DB users
// -----------------------------------------------------
export async function getOrganizationUsers(orgId) {
  const { userId } = await auth(); // Auth check

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Make sure user exists locally
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Use Clerk client to fetch all org members
  const client = await clerkClient();
  const organizationMemberships =
    await client.organizations.getOrganizationMembershipList({
      organizationId: orgId,
    });

  // Extract Clerk user IDs from the membership list
  const userIds = organizationMemberships.data.map(
    (membership) => membership.publicUserData.userId
  );

  // Match those IDs with users in your database
  const users = await db.user.findMany({
    where: {
      clerkUserId: {
        in: userIds,
      },
    },
  });

  return users; // Return the list of matched users
}