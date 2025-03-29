"use client"; 
// This is a Client Component because it uses React state, effects, and browser navigation

/**
 * components/SprintManager.js
 *
 * Purpose:
 * This component lets users:
 * - Select a sprint from a dropdown
 * - Start or end a sprint based on its current status and date
 * - See status badges like "Overdue" or "Starts in X"
 * - Handles sprint status updates and syncs UI
 */

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { BarLoader } from "react-spinners"; // Loading animation
import { formatDistanceToNow, isAfter, isBefore, format } from "date-fns"; // Date utilities
import useFetch from "@/hooks/use-fetch"; // Custom async handler
import { useRouter, useSearchParams } from "next/navigation"; // Router hooks
import { updateSprintStatus } from "@/actions/sprints"; // Server action to update sprint status

// SprintManager takes current sprint info and a list of sprints
export default function SprintManager({
  sprint,
  setSprint,
  sprints,
  projectId,
}) {
  const [status, setStatus] = useState(sprint.status);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    fn: updateStatus,
    loading,
    error,
    data: updatedStatus,
  } = useFetch(updateSprintStatus); // Handle sprint status updates

  // Parse sprint dates and current time
  const startDate = new Date(sprint.startDate);
  const endDate = new Date(sprint.endDate);
  const now = new Date();

  // Determine if sprint can be started
  const canStart =
    isBefore(now, endDate) && isAfter(now, startDate) && status === "PLANNED";

  // Determine if sprint can be ended
  const canEnd = status === "ACTIVE";

  // Trigger sprint status change
  const handleStatusChange = async (newStatus) => {
    updateStatus(sprint.id, newStatus);
  };

  // Update state/UI when sprint status is successfully updated
  useEffect(() => {
    if (updatedStatus && updatedStatus.success) {
      setStatus(updatedStatus.sprint.status);
      setSprint({
        ...sprint,
        status: updatedStatus.sprint.status,
      });
    }
  }, [updatedStatus, loading]);

  // Get dynamic label to show sprint state (e.g., starts in, overdue, ended)
  const getStatusText = () => {
    if (status === "COMPLETED") {
      return `Sprint Ended`;
    }
    if (status === "ACTIVE" && isAfter(now, endDate)) {
      return `Overdue by ${formatDistanceToNow(endDate)}`;
    }
    if (status === "PLANNED" && isBefore(now, startDate)) {
      return `Starts in ${formatDistanceToNow(startDate)}`;
    }
    return null;
  };

  // Handle sprint change from URL or dropdown
  useEffect(() => {
    const sprintId = searchParams.get("sprint");
    if (sprintId && sprintId !== sprint.id) {
      const selectedSprint = sprints.find((s) => s.id === sprintId);
      if (selectedSprint) {
        setSprint(selectedSprint);
        setStatus(selectedSprint.status);
      }
    }
  }, [searchParams, sprints]);

  // Handle sprint change from dropdown selection
  const handleSprintChange = (value) => {
    const selectedSprint = sprints.find((s) => s.id === value);
    setSprint(selectedSprint);
    setStatus(selectedSprint.status);
    router.replace(`/project/${projectId}`, undefined, { shallow: true });
  };

  return (
    <>
      {/* Top row: sprint selector and action buttons */}
      <div className="flex text-white justify-between items-center gap-4">
        {/* Sprint dropdown */}
        <Select value={sprint.id} onValueChange={handleSprintChange}>
          <SelectTrigger className="bg-slate-950 self-start">
            <SelectValue placeholder="Select Sprint" />
          </SelectTrigger>
          <SelectContent>
            {sprints.map((sprint) => (
              <SelectItem key={sprint.id} value={sprint.id}>
                {sprint.name} ({format(sprint.startDate, "MMM d, yyyy")} to{" "}
                {format(sprint.endDate, "MMM d, yyyy")})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Start Sprint Button */}
        {canStart && (
          <Button
            onClick={() => handleStatusChange("ACTIVE")}
            disabled={loading}
            className="bg-green-900 text-white"
          >
            Start Sprint
          </Button>
        )}

        {/* End Sprint Button */}
        {canEnd && (
          <Button
            onClick={() => handleStatusChange("COMPLETED")}
            disabled={loading}
            variant="destructive"
          >
            End Sprint
          </Button>
        )}
      </div>

      {/* Loading indicator */}
      {loading && <BarLoader width={"100%"} className="mt-2" color="#36d7b7" />}

      {/* Sprint status badge */}
      {getStatusText() && (
        <Badge variant="" className="mt-3 ml-1 self-start">
          {getStatusText()}
        </Badge>
      )}
    </>
  );
}