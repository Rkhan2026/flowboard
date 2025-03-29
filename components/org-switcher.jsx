"use client"; 
// Required because we're using React hooks and interactive Clerk components

/**
 * components/OrgSwitcher.js
 *
 * Purpose:
 * This component shows a Clerk organization switcher when the user is signed in.
 * - It hides on the homepage (/)
 * - It changes behavior depending on the route (e.g., modal vs. navigation)
 * - It only renders when both user and organization data are fully loaded
 */

import { usePathname } from "next/navigation"; 
// Hook to get the current route path

import {
  OrganizationSwitcher, // The actual dropdown switcher UI from Clerk
  SignedIn,             // Wrapper to conditionally render only when signed in
  useOrganization,      // Hook to access org data
  useUser,              // Hook to access user data
} from "@clerk/nextjs";

// OrgSwitcher component
const OrgSwitcher = () => {
  const { isLoaded } = useOrganization();      // Check if organization data has finished loading
  const { isLoaded: isUserLoaded } = useUser(); // Check if user data has finished loading
  const pathname = usePathname();              // Get current route path

  // Don’t show the switcher on the homepage ("/")
  if (pathname === "/") {
    return null;
  }

  // If either user or org data is still loading, don’t render anything
  if (!isLoaded || !isUserLoaded) {
    return null;
  }

  return (
    <div className="flex justify-end mt-1">
      {/* Only render for signed-in users */}
      <SignedIn>
        <OrganizationSwitcher
          hidePersonal // Hide the "personal account" option
          
          // Determines how org creation UI appears
          createOrganizationMode={
            pathname === "/onboarding" ? "navigation" : "modal"
          }

          // Where to go after creating a new org
          afterCreateOrganizationUrl="/organization/:slug"

          // Where to go after selecting an existing org
          afterSelectOrganizationUrl="/organization/:slug"

          // Route where the "create organization" process starts
          createOrganizationUrl="/onboarding"

          // Custom styles for the switcher button
          appearance={{
            elements: {
              organizationSwitcherTrigger:
                "border border-gray-300 rounded-md px-5 py-2", // Button style
              organizationSwitcherTriggerIcon: "text-white",  // Icon style
            },
          }}
        />
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher; 
// Export the component so it can be used in headers or dashboards