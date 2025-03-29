/**
 * app/sign-in/page.js
 *
 * Purpose:
 * This page renders the Clerk <SignIn /> component,
 * which provides a complete and customizable sign-in UI.
 *
 * Next.js will automatically route to this page when visiting /sign-in.
 */

import { SignIn } from "@clerk/nextjs"; // Clerk's prebuilt SignIn component

export default function Page() {
  return <SignIn />; // Renders the Clerk sign-in interface
}