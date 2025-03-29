/**
 * components/UserIssues.js
 *
 * Purpose:
 * Displays issues related to the currently logged-in user.
 * - Categorizes issues into "Assigned to you" and "Reported by you"
 * - Uses tabs to switch between the two categories
 * - Each issue is shown using the <IssueCard /> component
 */

import { Suspense } from "react";
import { getUserIssues } from "@/actions/organizations"; // Server-side action to fetch issues
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Tab UI components
import IssueCard from "@/components/issue-card"; // Individual issue card display

// Main component to show issues based on userId
export default async function UserIssues({ userId }) {
  // Fetch all issues where the user is a reporter or assignee
  const issues = await getUserIssues(userId);

  // If there are no related issues, show nothing
  if (issues.length === 0) {
    return null;
  }

  // Filter issues: assigned to user
  const assignedIssues = issues.filter(
    (issue) => issue.assignee?.clerkUserId === userId
  );

  // Filter issues: reported by user
  const reportedIssues = issues.filter(
    (issue) => issue.reporter?.clerkUserId === userId
  );

  return (
    <>
      {/* Section title */}
      <h1 className="text-4xl font-bold gradient-title mb-4">My Issues</h1>

      {/* Tab UI to switch between "assigned" and "reported" issues */}
      <Tabs defaultValue="assigned" className="w-full">
        <TabsList>
          <TabsTrigger value="assigned">Assigned to You</TabsTrigger>
          <TabsTrigger value="reported">Reported by You</TabsTrigger>
        </TabsList>

        {/* Tab: Assigned to you */}
        <TabsContent value="assigned">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={assignedIssues} />
          </Suspense>
        </TabsContent>

        {/* Tab: Reported by you */}
        <TabsContent value="reported">
          <Suspense fallback={<div>Loading...</div>}>
            <IssueGrid issues={reportedIssues} />
          </Suspense>
        </TabsContent>
      </Tabs>
    </>
  );
}

// Helper component to render issues in a responsive grid
function IssueGrid({ issues }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} showStatus />
      ))}
    </div>
  );
}