"use client"; 
// This tells Next.js that this component runs on the client side 
// because it uses hooks and interactive UI elements

/**
 * components/IssueDetailsDialog.js
 *
 * Purpose:
 * A modal dialog to show and manage issue details such as:
 * - Title, description, priority, and status
 * - Assignee and reporter
 * - Update and delete functionality (for allowed users)
 * - Inline markdown preview and live project navigation
 *
 * Features:
 * - Conditional rendering based on role (reporter/admin can edit/delete)
 * - Uses Clerk for user/org context and validation
 * - Shows loading states, handles optimistic UI updates
 */

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // UI dialog components
import { Button } from "@/components/ui/button"; // Reusable button
import MDEditor from "@uiw/react-md-editor"; // Markdown viewer/editor
import UserAvatar from "./user-avatar"; // Displays user avatar + name
import useFetch from "@/hooks/use-fetch"; // Custom hook to manage async API calls
import { useOrganization, useUser } from "@clerk/nextjs"; // Clerk hooks to access current user and org
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Dropdown UI components
import { BarLoader } from "react-spinners"; // Loading indicator
import { ExternalLink } from "lucide-react"; // Icon for navigation link
import { usePathname, useRouter } from "next/navigation"; // Navigation utilities

import statuses from "@/data/status"; // Status options for issues
import { deleteIssue, updateIssue } from "@/actions/issues"; // Server actions

// Priority dropdown options
const priorityOptions = ["LOW", "MEDIUM", "HIGH", "URGENT"];

// Main component
export default function IssueDetailsDialog({
  isOpen,        // Whether the dialog is open
  onClose,       // Callback to close dialog
  issue,         // Issue object with full info
  onDelete = () => {}, // Optional callback when issue is deleted
  onUpdate = () => {}, // Optional callback when issue is updated
  borderCol = "",      // Optional border color for styling
}) {
  // Local state for status and priority dropdowns
  const [status, setStatus] = useState(issue.status);
  const [priority, setPriority] = useState(issue.priority);

  // Get current user and org membership
  const { user } = useUser();
  const { membership } = useOrganization();

  const router = useRouter();     // For navigation
  const pathname = usePathname(); // Get current route path

  // Use custom hook to handle delete action
  const {
    loading: deleteLoading,
    error: deleteError,
    fn: deleteIssueFn,
    data: deleted,
  } = useFetch(deleteIssue);

  // Use custom hook to handle update action
  const {
    loading: updateLoading,
    error: updateError,
    fn: updateIssueFn,
    data: updated,
  } = useFetch(updateIssue);

  // Delete issue handler
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this issue?")) {
      deleteIssueFn(issue.id);
    }
  };

  // Update status handler
  const handleStatusChange = async (newStatus) => {
    setStatus(newStatus);
    updateIssueFn(issue.id, { status: newStatus, priority });
  };

  // Update priority handler
  const handlePriorityChange = async (newPriority) => {
    setPriority(newPriority);
    updateIssueFn(issue.id, { status, priority: newPriority });
  };

  // Watch for updates and deletions to sync UI and trigger parent actions
  useEffect(() => {
    if (deleted) {
      onClose();
      onDelete(); // Notify parent
    }
    if (updated) {
      onUpdate(updated); // Notify parent with updated issue
    }
  }, [deleted, updated, deleteLoading, updateLoading]);

  // Only allow reporter or org admin to make changes
  const canChange =
    user.id === issue.reporter.clerkUserId || membership.role === "org:admin";

  // Navigate to project board page
  const handleGoToProject = () => {
    router.push(`/project/${issue.projectId}?sprint=${issue.sprintId}`);
  };

  // Check if we're NOT already on a project page
  const isProjectPage = !pathname.startsWith("/project/");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex justify-between items-center">
            <DialogTitle className="text-3xl">{issue.title}</DialogTitle>
            {/* Show external link button if not on project page */}
            {isProjectPage && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoToProject}
                title="Go to Project"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        {/* Show loading bar while updating or deleting */}
        {(updateLoading || deleteLoading) && (
          <BarLoader width={"100%"} color="#36d7b7" />
        )}

        {/* Main content section */}
        <div className="space-y-4">
          {/* Status & Priority Dropdowns */}
          <div className="flex items-center space-x-2">
            {/* Status dropdown */}
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((option) => (
                  <SelectItem key={option.key} value={option.key}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Priority dropdown */}
            <Select
              value={priority}
              onValueChange={handlePriorityChange}
              disabled={!canChange} // Only reporter/admin can change
            >
              <SelectTrigger className={`border ${borderCol} rounded`}>
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                {priorityOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description preview (Markdown) */}
          <div>
            <h4 className="font-semibold">Description</h4>
            <MDEditor.Markdown
              className="rounded px-2 py-1"
              source={issue.description ? issue.description : "--"}
            />
          </div>

          {/* Assignee & Reporter info */}
          <div className="flex justify-between">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Assignee</h4>
              <UserAvatar user={issue.assignee} />
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold">Reporter</h4>
              <UserAvatar user={issue.reporter} />
            </div>
          </div>

          {/* Delete Button */}
          {canChange && (
            <Button
              onClick={handleDelete}
              disabled={deleteLoading}
              variant="destructive"
            >
              {deleteLoading ? "Deleting..." : "Delete Issue"}
            </Button>
          )}

          {/* Error message display */}
          {(deleteError || updateError) && (
            <p className="text-red-500">
              {deleteError?.message || updateError?.message}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}