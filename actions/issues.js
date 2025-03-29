"use server"; // Marks this file as a server action module in Next.js

/**
 * actions/issues.js
 *
 * Purpose:
 * Server-side functions (actions) for managing issues in the project management app.
 * These are used to fetch, create, update, delete, and reorder issues in the database.
 * All functions are protected using Clerk authentication and scoped to the current organization.
 */

import { db } from "@/lib/prisma"; // Prisma client to interact with the database
import { auth } from "@clerk/nextjs/server"; // Auth helper to get user/org info from Clerk

/**
 * Fetches all issues linked to a specific sprint
 * - Requires user to be authenticated and part of an org
 * - Issues are sorted by status and order (for Kanban-style UI)
 */
export async function getIssuesForSprint(sprintId) {
  const { userId, orgId } = await auth(); // Get current user and organization

  if (!userId || !orgId) {
    throw new Error("Unauthorized"); // Ensure user is signed in and belongs to an org
  }

  const issues = await db.issue.findMany({
    where: { sprintId: sprintId }, // Filter by sprint ID
    orderBy: [{ status: "asc" }, { order: "asc" }], // Sort by status and order
    include: {
      assignee: true, // Include user assigned to issue
      reporter: true, // Include user who created the issue
    },
  });

  return issues; // Return the list of issues
}

/**
 * Creates a new issue in a project
 * - Adds reporter based on the current user
 * - Assigns order value based on current status column
 */
export async function createIssue(projectId, data) {
  const { userId, orgId } = await auth(); // Get current user and org

  if (!userId || !orgId) {
    throw new Error("Unauthorized"); // Block access if unauthenticated
  }

  // Fetch the user record from the database
  let user = await db.user.findUnique({ where: { clerkUserId: userId } });

  // Find the last issue in the same status column to determine order
  const lastIssue = await db.issue.findFirst({
    where: { projectId, status: data.status },
    orderBy: { order: "desc" }, // Get highest order
  });

  const newOrder = lastIssue ? lastIssue.order + 1 : 0; // Set order value

  // Create the issue in the DB
  const issue = await db.issue.create({
    data: {
      title: data.title, // Issue title
      description: data.description, // Optional description
      status: data.status, // Status (e.g., TODO)
      priority: data.priority, // Priority (e.g., HIGH)
      projectId: projectId, // Connect to project
      sprintId: data.sprintId, // Optional sprint link
      reporterId: user.id, // Set reporter as the current user
      assigneeId: data.assigneeId || null, // Set assignee if provided
      order: newOrder, // Set order
    },
    include: {
      assignee: true,
      reporter: true,
    },
  });

  return issue; // Return the newly created issue
}

/**
 * Updates the order and status of multiple issues
 * - Typically used when dragging issues in a board UI
 */
export async function updateIssueOrder(updatedIssues) {
  const { userId, orgId } = await auth(); // Get user and org

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Run updates in a transaction to ensure atomicity
  await db.$transaction(async (prisma) => {
    for (const issue of updatedIssues) {
      await prisma.issue.update({
        where: { id: issue.id },
        data: {
          status: issue.status, // Update status (e.g., moved from TODO to IN_PROGRESS)
          order: issue.order, // Update new position in the list
        },
      });
    }
  });

  return { success: true }; // Return success status
}

/**
 * Deletes an issue
 * - Only allowed if the current user is the reporter or a project admin
 */
export async function deleteIssue(issueId) {
  const { userId, orgId } = await auth(); // Get current user/org

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  // Get user from DB to access internal ID
  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Fetch the issue with its project (to access admin IDs)
  const issue = await db.issue.findUnique({
    where: { id: issueId },
    include: { project: true },
  });

  if (!issue) {
    throw new Error("Issue not found");
  }

  // Check if user is the reporter or an admin in the project
  if (
    issue.reporterId !== user.id &&
    !issue.project.adminIds.includes(user.id)
  ) {
    throw new Error("You don't have permission to delete this issue");
  }

  // Perform delete
  await db.issue.delete({ where: { id: issueId } });

  return { success: true }; // Return confirmation
}

/**
 * Updates an issue’s status or priority
 * - Validates user and organization ownership before making changes
 */
export async function updateIssue(issueId, data) {
  const { userId, orgId } = await auth(); // Get current user/org

  if (!userId || !orgId) {
    throw new Error("Unauthorized");
  }

  try {
    // Find the issue with its associated project
    const issue = await db.issue.findUnique({
      where: { id: issueId },
      include: { project: true },
    });

    if (!issue) {
      throw new Error("Issue not found");
    }

    // Check if the issue belongs to the current org
    if (issue.project.organizationId !== orgId) {
      throw new Error("Unauthorized");
    }

    // Update the issue in DB
    const updatedIssue = await db.issue.update({
      where: { id: issueId },
      data: {
        status: data.status, // Update status
        priority: data.priority, // Update priority
      },
      include: {
        assignee: true,
        reporter: true,
      },
    });

    return updatedIssue; // Return updated issue
  } catch (error) {
    // Catch and throw a clean error message
    throw new Error("Error updating issue: " + error.message);
  }
}