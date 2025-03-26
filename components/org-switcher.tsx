"use client";

import { usePathname } from "next/navigation";
import {
  OrganizationSwitcher,
  SignedIn,
  useOrganization,
  useUser,
} from "@clerk/nextjs";
import React from "react";

const OrgSwitcher: React.FC = () => {
  const { isLoaded: isOrgLoaded } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  const shouldUseNavigationMode = pathname === "/onboarding";

  return (
    <div className="flex justify-end mt-1">
      <SignedIn>
        <OrganizationSwitcher
          hidePersonal
          {...(shouldUseNavigationMode && {
            createOrganizationMode: "navigation" as const,
          })}
          afterCreateOrganizationUrl="/organization/:slug"
          afterSelectOrganizationUrl="/organization/:slug"
          createOrganizationUrl="/onboarding"
          appearance={{
            elements: {
              organizationSwitcherTrigger: 
                "border border-gray-300 rounded-md px-5 py-2 text-white",
              organizationSwitcherTriggerIcon: "text-white",
              organizationSwitcherTriggerButton: "text-white", // apply to the clickable text
            },
          }}
        />
      </SignedIn>
    </div>
  );
};

export default OrgSwitcher;