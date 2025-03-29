/**
 * components/UserAvatar.js
 *
 * Purpose:
 * This component displays a small user avatar alongside the user's name.
 * It uses the Avatar UI component, with support for a fallback if the image is missing.
 * Useful in places like issue cards, assignments, or user lists.
 */

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"; 
// Custom Avatar component with image, fallback text, and styling

// Main component that accepts a `user` object as prop
const UserAvatar = ({ user }) => {
  return (
    // Flex container to align avatar and name horizontally
    <div className="flex items-center space-x-2 w-full">
      
      {/* Avatar container (small size: 24x24px) */}
      <Avatar className="h-6 w-6">
        {/* Show user's profile image if available */}
        <AvatarImage src={user?.imageUrl} alt={user?.name} />

        {/* Fallback: show user's name initial or '?' if user is not set */}
        <AvatarFallback className="capitalize">
          {user ? user.name : "?"}
        </AvatarFallback>
      </Avatar>

      {/* Display user's name or "Unassigned" if user is null */}
      <span className="text-xs text-gray-500">
        {user ? user.name : "Unassigned"}
      </span>
    </div>
  );
};

export default UserAvatar;
// Export the component so it can be reused across the app