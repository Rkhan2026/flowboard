import { getProject } from "@/actions/projects";
import { notFound } from "next/navigation";

export default async function ProjectPage({ params }) {
  const { projectId } = await params;
  const project = await getProject(projectId);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto">
     
     
        <div>Create a Sprint from button above</div>
      
    </div>
  );
}