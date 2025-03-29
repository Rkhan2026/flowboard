/**
 * app/project/[projectId]/page.js
 *
 * Purpose:
 * This is the main project board page.
 * - Fetches a specific project's data using its ID
 * - Shows a form to create new sprints
 * - Displays the sprint board if sprints exist
 * - Uses `notFound()` to show 404 if project doesn't exist
 */

import { getProject } from "@/actions/projects"; // Action to fetch project with sprints
import { notFound } from "next/navigation"; // Redirect to 404 page if needed
import SprintCreationForm from "../_components/create-sprint"; // Form to create a sprint
import SprintBoard from "../_components/sprint-board"; // Kanban-like board to show sprint tasks

// Server component for the dynamic project page
export default async function ProjectPage({ params }) {
  const { projectId } = await params; // Extract projectId from URL
  const project = await getProject(projectId); // Fetch project data

  // If project doesn't exist or is inaccessible, show 404
  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto">
      {/* Form to create a new sprint */}
      <SprintCreationForm
        projectTitle={project.name}
        projectId={projectId}
        projectKey={project.key}
        sprintKey={project.sprints?.length + 1} // Suggest next sprint number
      />

      {/* Show sprint board if any sprints exist */}
      {project.sprints.length > 0 ? (
        <SprintBoard
          sprints={project.sprints}
          projectId={projectId}
          orgId={project.organizationId}
        />
      ) : (
        // Fallback UI when no sprints exist
        <div>Create a Sprint from button above</div>
      )}
    </div>
  );
}