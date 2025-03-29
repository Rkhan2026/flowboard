/**
 * components/Header.js
 *
 * Purpose:
 * This is the top-level header component used across the application.
 * It includes:
 * - Logo (linking to homepage)
 * - "Create Project" button
 * - Login button (if signed out)
 * - User menu (if signed in)
 * - Ensures user is synced with DB via `checkUser`
 * - Shows a loading indicator while user/org data is loading
 */

import React from "react";
import { Button } from "./ui/button"; // Reusable button component
import Link from "next/link"; // Next.js navigation component
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs"; // Clerk components for auth states
import UserMenu from "./user-menu"; // Custom user dropdown with organization links
import { PenBox } from "lucide-react"; // Icon for "Create Project"
import Image from "next/image"; // Next.js optimized image component
import { checkUser } from "@/lib/checkUser"; // Sync Clerk user with local DB
import UserLoading from "./user-loading"; // Loading bar for Clerk session loading

// Header is an async Server Component because it runs `checkUser()`
async function Header() {
  // Ensure the Clerk user exists in the local database
  await checkUser();

  return (
    <header className="container mx-auto">
      {/* Main navigation bar layout */}
      <nav className="py-6 px-4 flex justify-between items-center">
        {/* Logo on the left, links to homepage */}
        <Link href="/">
          <h1 className="text-2xl font-bold">
            <Image
              src={"/logo2.png"} // Logo image path
              alt="FlowBoard Logo" // Accessibility alt text
              width={200}
              height={56}
              className="h-10 w-auto object-contain" // Keeps logo responsive
            />
          </h1>
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center gap-4">
          {/* Create Project Button */}
          <Link href="/project/create">
            <Button variant="destructive" className="flex items-center gap-2">
              <PenBox size={18} />
              <span className="hidden md:inline">Create Project</span>
              {/* Only show text on medium and larger screens */}
            </Button>
          </Link>

          {/* Show Login button if user is signed out */}
          <SignedOut>
            <SignInButton forceRedirectUrl="/onboarding">
              <Button variant="outline">Login</Button>
            </SignInButton>
          </SignedOut>

          {/* Show UserMenu (avatar + dropdown) if signed in */}
          <SignedIn>
            <UserMenu />
          </SignedIn>
        </div>
      </nav>

      {/* Show loading bar while user/org context is loading */}
      <UserLoading />
    </header>
  );
}

export default Header; // Export the header so it can be used in layout.js or other components