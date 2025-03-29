"use client"; 
// This tells Next.js that this file is a Client Component.
// It's required because we use React hooks (`useUser`, `useOrganization`) which only run on the client side.

/**
 * components/UserLoading.js
 *
 * Purpose:
 * This component displays a loading bar while Clerk is loading the current user and organization data.
 * It's useful to prevent rendering parts of the UI that depend on authentication or org context too early.
 */

import { useOrganization, useUser } from "@clerk/nextjs"; 
// Clerk hooks to get the currently signed-in user and organization data

import React from "react";
import { BarLoader } from "react-spinners"; 
// A slim loading bar component for visual feedback

const UserLoading = () => {
  const { isLoaded } = useOrganization(); // True when organization data has loaded
  const { isLoaded: isUserLoaded } = useUser(); // True when user data has loaded

  // Show a loading bar if either the user or organization data is still loading
  if (!isLoaded || !isUserLoaded) {
    return (
      <BarLoader 
        className="mb-4"      // Adds bottom margin to the loader
        width={"100%"}        // Takes full width of parent container
        color="#36d7b7"       // Sets the loader's color
      />
    );
  } else {
    // Once both user and organization are loaded, render nothing
    return <></>;
  }
};

export default UserLoading; 
// Export the component so it can be used wherever user/org data is needed before rendering UI