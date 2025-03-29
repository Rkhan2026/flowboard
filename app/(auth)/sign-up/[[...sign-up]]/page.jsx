/**
 * app/sign-up/page.js
 *
 * Purpose:
 * This page renders the Clerk <SignUp /> component,
 * which provides a full registration/sign-up UI for new users.
 *
 * Next.js automatically maps this file to the /sign-up route.
 */

import { SignUp } from "@clerk/nextjs"; // Clerk's prebuilt SignUp component

export default function Page() {
  return <SignUp />; // Renders the user registration interface
}