/**
 * app/organization/[orgId]/page.js
 *
 * Purpose:
 * This is the main dashboard page for a specific organization.
 * It:
 * - Verifies authentication and organization access
 * - Displays the organization’s name
 * - Renders the project list for that org
 * - Shows issues assigned or reported by the logged-in user
 * - Provides an organization switcher (via Clerk)
 */

import { auth } from "@clerk/nextjs/server"; // Server-side Clerk auth
import { redirect } from "next/navigation"; // Redirect helper for protected routes
import { getOrganization } from "@/actions/organizations"; // Action to fetch org by ID
import OrgSwitcher from "@/components/org-switcher"; // Dropdown to switch between orgs
import ProjectList from "./_components/project-list"; // Component showing projects in the org
import UserIssues from "./_components/user-issues"; // Component showing current user's issues

// Server component for the organization page
export default async function OrganizationPage({ params }) {
  const { orgId } = await params; // Get the dynamic orgId from the URL
  const { userId } = await auth(); // Get the current authenticated user

  // If user is not authenticated, redirect to sign-in page
  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch the organization details using the orgId
  const Organization = await getOrganization(orgId);

  // If the org is not found or user is not a member, show error
  if (!Organization) {
    return <div>Organization not found</div>;
  }

  return (
    <div className="container mx-auto px-4">
      {/* Page header with org name and org switcher */}
      <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
        <h1 className="text-5xl font-bold gradient-title pb-2">
          {Organization.name}&rsquo;s Projects
        </h1>
        <OrgSwitcher />
      </div>

      {/* Project list section */}
      <div className="mb-4">
        <ProjectList orgId={Organization.id} />
      </div>

      {/* User's issues section */}
      <div className="mt-8">
        <UserIssues userId={userId} />
      </div>
    </div>
  );
}