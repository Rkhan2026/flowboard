"use client"; 
// This is a Client Component because it uses hooks, side effects, and browser APIs

/**
 * components/DeleteProject.js
 *
 * Purpose:
 * This component renders a small delete button (trash icon) for a project.
 * - Only visible to users with the "org:admin" role
 * - Uses a confirmation dialog before deleting
 * - Shows a pulse animation while deleting
 * - Refreshes the project list after successful deletion
 */

import { useEffect } from "react";
import { Button } from "@/components/ui/button"; // Reusable styled button
import { Trash2 } from "lucide-react"; // Trash icon
import { useOrganization } from "@clerk/nextjs"; // Get current user's org membership
import { deleteProject } from "@/actions/projects"; // Server-side action to delete a project
import { useRouter } from "next/navigation"; // For page refresh after deletion
import useFetch from "@/hooks/use-fetch"; // Custom hook for async request states

export default function DeleteProject({ projectId }) {
  const { membership } = useOrganization(); // Get the user's role in the current org
  const router = useRouter(); // Next.js router for client-side actions

  // Hook for managing delete API call
  const {
    loading: isDeleting, // True while deleting
    error,               // Any error from the request
    fn: deleteProjectFn, // Trigger function for deletion
    data: deleted,       // Response after successful deletion
  } = useFetch(deleteProject);

  // Check if user is an admin in the organization
  const isAdmin = membership?.role === "org:admin";

  // Handle the delete action (with confirmation)
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectFn(projectId); // Call deleteProject server action
    }
  };

  // When deletion is successful, refresh the project list
  useEffect(() => {
    if (deleted) {
      router.refresh(); // Refresh the route to remove the deleted project from UI
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleted]);

  // Only render the button if the user is an admin
  if (!isAdmin) return null;

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className={`${isDeleting ? "animate-pulse" : ""}`} // Animate while loading
        onClick={handleDelete}
        disabled={isDeleting} // Disable button during deletion
      >
        <Trash2 className="h-4 w-4" /> {/* Trash icon */}
      </Button>

      {/* Show error message if deletion fails */}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </>
  );
}