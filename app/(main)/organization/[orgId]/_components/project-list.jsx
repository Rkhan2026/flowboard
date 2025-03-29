/**
 * components/ProjectList.jsx
 *
 * Purpose:
 * Renders a list of all projects under a specific organization.
 * - If no projects exist, it prompts the user to create one.
 * - Each project is displayed in a card with name, description, and a delete button.
 * - Includes a link to view the full project.
 */

import Link from "next/link"; // For client-side routing
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"; // Reusable card components
import { getProjects } from "@/actions/organizations"; // Fetch projects by org ID
import DeleteProject from "./delete-project"; // Button/component to delete a project

// Server component to render the project list for a given organization
export default async function ProjectList({ orgId }) {
  // Fetch all projects for the current organization
  const projects = await getProjects(orgId);

  // Show message if no projects are available
  if (projects.length === 0) {
    return (
      <p>
        No projects found.{" "}
        <Link
          className="underline underline-offset-2 text-blue-200"
          href="/project/create"
        >
          Create New.
        </Link>
      </p>
    );
  }

  return (
    // Display projects in a responsive grid
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              {project.name}
              {/* Delete button (visible to org admins) */}
              <DeleteProject projectId={project.id} />
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Optional description */}
            <p className="text-sm text-gray-500 mb-4">
              {project.description}
            </p>

            {/* Link to project details page */}
            <Link
              href={`/project/${project.id}`}
              className="text-blue-500 hover:underline"
            >
              View Project
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}