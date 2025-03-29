"use client"; 
// This directive tells Next.js that this component is a client-side component
// Required because it uses interactive UI and Clerk components

// ------------------------------------------------------------
// UserMenu Component
// - Displays the Clerk user avatar with a dropdown menu
// - Adds custom menu items like "My Organizations"
// ------------------------------------------------------------

import { UserButton } from "@clerk/nextjs"; 
// Clerk's user avatar component that includes a dropdown menu

import { ChartNoAxesGantt } from "lucide-react"; 
// Importing an icon from Lucide React to use in the menu

// UserMenu component
const UserMenu = () => {
  return (
    // UserButton renders the avatar and manages the dropdown menu
    <UserButton
      appearance={{
        elements: {
          avatarBox: "w-10 h-10", // Tailwind classes to control avatar size (width: 40px, height: 40px)
        },
      }}
    >
      {/* UserButton.MenuItems defines custom dropdown options */}
      <UserButton.MenuItems>

        {/* A link item in the dropdown menu */}
        <UserButton.Link
          label="My Organizations" // Text shown in the dropdown
          labelIcon={<ChartNoAxesGantt size={15} />} // Icon shown next to the label
          href="/onboarding" // Where this link navigates to when clicked
        />

        {/* A built-in action that lets users manage their Clerk account */}
        <UserButton.Action label="manageAccount" /> 
        // Opens Clerk's hosted account management page
      </UserButton.MenuItems>
    </UserButton>
  );
};

// Export the component for use in layout or header
export default UserMenu;