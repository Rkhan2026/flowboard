"use server";

/**
 * actions/projects.js
 *
 * Purpose:
 * This file contains server-side functions for managing projects
 * within an organization using Prisma and Clerk in a Next.js app.
 *
 * Functions:
 * - createProject: Allows an org admin to create a new project
 * - getProject: Fetches a single project along with its sprints
 * - deleteProject: Deletes a project if the user is an admin
 *
 * Usage:
 * These functions are used in server components or actions where
 * authenticated and scoped access to organization-specific project
 * data is required.
 */

import { db } from "@/lib/prisma"; // Prisma client to interact with the database
import { auth, clerkClient } from "@clerk/nextjs/server"; // Clerk auth and org tools

// ----------------------------------------------------
// Create a new project within the currently selected org
// Only users with "org:admin" role can create projects
// ----------------------------------------------------
export async function createProject(data) {
  const { userId, orgId } = await auth(); // Get the logged-in user's ID and org

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (!orgId) {
    throw new Error("No Organization Selected");
  }

  // Use Clerk client to get the org's member list
  const client = await clerkClient();
  const { data: membershipList } = await client.organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });

  // Find current user's membership and role
  const userMembership = membershipList.find(
    (membership) => membership.publicUserData?.userId === userId
  );

  // Only allow org admins to create projects
  if (!userMembership || userMembership.role !== "org:admin") {
    throw new Error("Only organization admins can create projects");
  }

  try {
    // Create the project in your database
    const project = await db.project.create({
      data: {
        name: data.name,             // Project name
        key: data.key,               // Unique short key (e.g., PROJ)
        description: data.description, // Optional description
        organizationId: orgId,       // Link to current org
      },
    });

    return project; // Return the new project
  } catch (error) {
    // Return clean error message
    if (error instanceof Error) {
      throw new Error("Error creating project: " + error.message);
    } else {
      throw new Error("Error creating project: " + String(error));
    }
  }
}

// ----------------------------------------------------
// Get a single project by ID
// Includes associated sprints, ordered by newest first
// ----------------------------------------------------
export async function getProject(projectId) {
  const { userId, orgId } = await auth(); // Get user and org from session

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Check that the user exists in your DB
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Fetch project from DB, including related sprints
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: {
      sprints: {
        orderBy: { createdAt: "desc" }, // Sort sprints by latest created
      },
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  // Make sure the project belongs to the current org
  if (project.organizationId !== orgId) {
    return null; // Access denied for different org
  }

  return project; // Return project with sprint data
}

// ----------------------------------------------------
// Delete a project by ID
// Only users with "org:admin" role are allowed
// ----------------------------------------------------
export async function deleteProject(projectId) {
  const { userId, orgId, orgRole } = await auth(); // Get user, org, and their org-level role

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Ensure user has admin privileges
  if (orgRole !== "org:admin") {
    throw new Error("Only organization admins can delete projects");
  }

  // Fetch the project to verify ownership
  const project = await db.project.findUnique({
    where: { id: projectId },
  });

  // Make sure the project exists and belongs to current org
  if (!project || project.organizationId !== orgId) {
    throw new Error(
      "Project not found or you don't have permission to delete it"
    );
  }

  // Delete the project
  await db.project.delete({
    where: { id: projectId },
  });

  return { success: true }; // Confirm deletion
}