"use server";

/**
 * actions/sprints.js
 *
 * Purpose:
 * This file contains server-side functions for managing sprints within projects
 * in a multi-tenant project management system using Clerk for auth and Prisma for data.
 *
 * Functions:
 * - createSprint: Adds a new sprint to a given project
 * - updateSprintStatus: Updates the status of a sprint (PLANNED, ACTIVE, COMPLETED)
 *
 * Usage:
 * These functions are used in server components or API routes for securely managing
 * sprint data associated with a specific project and organization.
 */

import { db } from "@/lib/prisma"; // Prisma client for database operations
import { auth } from "@clerk/nextjs/server"; // Clerk authentication utilities

// --------------------------------------------------------
// Create a new sprint for a given project
// Only allowed if user is part of the org and project exists
// --------------------------------------------------------
export async function createSprint(projectId, data) {
  const { userId, orgId } = await auth(); // Get current user and org from session

  if (!userId || !orgId) {
    throw new Error("Unauthorized"); // Make sure user is authenticated
  }

  // Fetch project to confirm it exists and belongs to the same org
  const project = await db.project.findUnique({
    where: { id: projectId },
    include: { sprints: { orderBy: { createdAt: "desc" } } }, // Optional: for future logic
  });

  if (!project || project.organizationId !== orgId) {
    throw new Error("Project not found"); // Project doesn’t exist or doesn't belong to org
  }

  // Create the sprint with default status PLANNED
  const sprint = await db.sprint.create({
    data: {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      status: "PLANNED",
      projectId: projectId,
    },
  });

  return sprint; // Return the new sprint
}

// --------------------------------------------------------
// Update the status of a sprint (PLANNED → ACTIVE → COMPLETED)
// Only admins can update sprint status
// --------------------------------------------------------
export async function updateSprintStatus(sprintId, newStatus) {
  const { userId, orgId, orgRole } = await auth(); // Get user, org, and their role

  if (!userId || !orgId) {
    throw new Error("Unauthorized"); // Must be signed in and part of an org
  }

  try {
    // Find the sprint and its associated project
    const sprint = await db.sprint.findUnique({
      where: { id: sprintId },
      include: { project: true },
    });

    console.log(sprint, orgRole); // Debug (can remove in production)

    if (!sprint) {
      throw new Error("Sprint not found");
    }

    // Ensure the sprint is from the same org
    if (sprint.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    // Only org admins can change sprint status
    if (orgRole !== "org:admin") {
      throw new Error("Only Admin can make this change");
    }

    const now = new Date();
    const startDate = new Date(sprint.startDate);
    const endDate = new Date(sprint.endDate);

    // Can't start a sprint if the current date is outside its start/end range
    if (newStatus === "ACTIVE" && (now < startDate || now > endDate)) {
      throw new Error("Cannot start sprint outside of its date range");
    }

    // Can only complete a sprint if it's currently ACTIVE
    if (newStatus === "COMPLETED" && sprint.status !== "ACTIVE") {
      throw new Error("Can only complete an active sprint");
    }

    // Update the sprint's status
    const updatedSprint = await db.sprint.update({
      where: { id: sprintId },
      data: { status: newStatus },
    });

    return { success: true, sprint: updatedSprint };
  } catch (error) {
    throw new Error(error.message); // Return error with clean message
  }
}