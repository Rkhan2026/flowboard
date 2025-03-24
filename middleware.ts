import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define protected routes
const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organisation(.*)",
  "/project(.*)",
  "/issue(.*)",
  "/sprint(.*)",
]);

// Middleware logic
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect()
})


// Matcher configuration
export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless explicitly matched
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always include API routes
    '/(api|trpc)(.*)',
  ],
};