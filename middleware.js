/**
 * middleware.ts - Handles route protection and onboarding redirects
 *
 * What this does:
 * - Blocks access to certain routes if you're not signed in
 * - Redirects signed-in users to onboarding if they haven't picked an organization yet
 *
 * This runs automatically for matched routes before the actual page or API loads.
 */

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// List of routes that need the user to be signed in
const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organisation(.*)",
  "/project(.*)",
  "/issue(.*)",
  "/sprint(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId, orgId, redirectToSignIn } = await auth();

  // If the user isn't signed in and they're trying to access a protected page, send them to sign-in
  if (!userId && isProtectedRoute(req)) {
    return redirectToSignIn();
  }

  // If they're signed in but haven't selected an organization, send them to onboarding
  if (
    userId &&
    !orgId &&
    req.nextUrl.pathname !== "/onboarding" &&
    req.nextUrl.pathname !== "/"
  ) {
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }

  // Everything's good — let the request through
  return NextResponse.next();
});

// Tell Next.js when to run this middleware
export const config = {
  matcher: [
    // Ignore static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",

    // Always run for API and TRPC routes
    "/(api|trpc)(.*)",
  ],
};