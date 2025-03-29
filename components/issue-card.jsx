"use client";
// Required because this component uses React hooks and interactivity

/**
 * components/IssueCard.js
 *
 * Purpose:
 * This component renders an interactive card UI for a single issue.
 * - Displays the issue's title, priority, status (optional), assignee, and creation time
 * - Clicking the card opens a modal with full issue details (via IssueDetailsDialog)
 * - Updates and deletions auto-refresh the page via Next.js router
 */

import { useState } from "react";
import { Badge } from "@/components/ui/badge"; // Small label UI (e.g., for status/priority)
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"; // Card layout components
import { formatDistanceToNow } from "date-fns"; // Utility to format relative time
import IssueDetailsDialog from "./issue-details-dialog"; // Modal for full issue view/edit/delete
import UserAvatar from "./user-avatar"; // Avatar component for assignee
import { useRouter } from "next/navigation"; // Next.js router for refreshing UI

// Mapping of priority levels to border color classes
const priorityColor = {
  LOW: "border-green-600",
  MEDIUM: "border-yellow-300",
  HIGH: "border-orange-400",
  URGENT: "border-red-400",
};

// Main component
export default function IssueCard({
  issue,              // The issue object (with title, priority, etc.)
  showStatus = false, // Whether to show the status badge (optional)
  onDelete = () => {},// Callback when an issue is deleted
  onUpdate = () => {},// Callback when an issue is updated
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Tracks whether the modal is open
  const router = useRouter(); // Used to refresh the page on changes

  // When the issue is deleted from the modal
  const onDeleteHandler = (...params) => {
    router.refresh(); // Refresh the list after deletion
    onDelete(...params); // Trigger parent callback
  };

  // When the issue is updated from the modal
  const onUpdateHandler = (...params) => {
    router.refresh(); // Refresh to reflect changes
    onUpdate(...params); // Trigger parent callback
  };

  // Format when the issue was created (e.g., "5 minutes ago")
  const created = formatDistanceToNow(new Date(issue.createdAt), {
    addSuffix: true,
  });

  return (
    <>
      {/* Card UI for the issue */}
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow" // Hover effect
        onClick={() => setIsDialogOpen(true)} // Open modal when clicked
      >
        <CardHeader
          className={`border-t-2 ${priorityColor[issue.priority]} rounded-lg`} // Colored top border based on priority
        >
          <CardTitle>{issue.title}</CardTitle>
        </CardHeader>

        {/* Tags for status and priority */}
        <CardContent className="flex gap-2 -mt-3">
          {showStatus && <Badge>{issue.status}</Badge>}
          <Badge variant="outline" className="-ml-1">
            {issue.priority}
          </Badge>
        </CardContent>

        {/* Footer with assignee and created time */}
        <CardFooter className="flex flex-col items-start space-y-3">
          <UserAvatar user={issue.assignee} /> {/* Shows assignee or "Unassigned" */}
          <div className="text-xs text-gray-400 w-full">
            Created {created}
          </div>
        </CardFooter>
      </Card>

      {/* Conditionally render the details modal */}
      {isDialogOpen && (
        <IssueDetailsDialog
          isOpen={isDialogOpen}                   // Modal open state
          onClose={() => setIsDialogOpen(false)} // Close modal
          issue={issue}                          // Pass full issue data
          onDelete={onDeleteHandler}             // Pass custom delete handler
          onUpdate={onUpdateHandler}             // Pass custom update handler
          borderCol={priorityColor[issue.priority]} // Use same border color inside modal
        />
      )}
    </>
  );
}