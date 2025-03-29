"use client"; 
// This is a Client Component because it uses hooks and navigation

/**
 * components/Onboarding.js or app/onboarding/page.js
 *
 * Purpose:
 * - Displays the Clerk <OrganizationList> component for users to
 *   select or create an organization.
 * - Automatically redirects the user to their selected organization's page.
 * - Skips rendering the org list if the user is already in an organization.
 */

import { OrganizationList, useOrganization } from "@clerk/nextjs"; 
// Clerk components: to display orgs and get the current one
import { useRouter } from "next/navigation"; // Used for client-side routing
import { useEffect } from "react";

// Onboarding page component
export default function Onboarding() {
  const { organization } = useOrganization(); // Get the currently active organization
  const router = useRouter(); // Initialize Next.js router

  useEffect(() => {
    // If the user already has an active organization, redirect them
    if (organization) {
      router.push(`/organization/${organization.slug}`);
    }

    // Note: we intentionally omit 'router' from deps to avoid unnecessary re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organization]);

  return (
    // Center the organization list UI on the screen
    <div className="flex justify-center items-center pt-14">
      <OrganizationList
        hidePersonal // Do not show personal workspace
        afterCreateOrganizationUrl="/organization/:slug" // Redirect after creating a new org
        afterSelectOrganizationUrl="/organization/:slug" // Redirect after selecting an existing org
      />
    </div>
  );
}