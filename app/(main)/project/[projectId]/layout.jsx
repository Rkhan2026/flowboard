/**
 * app/project/[projectId]/layout.js
 *
 * Purpose:
 * This layout wraps all child routes inside a specific project.
 * - Provides a consistent wrapper for project-specific pages
 * - Uses <Suspense> to show a loading indicator while child components load
 */

import { Suspense } from "react"; // Suspense enables loading fallback for async components
import { BarLoader } from "react-spinners"; // A simple animated loading bar

// Layout component for /project/[projectId] routes
export default async function ProjectLayout({ children }) {
  return (
    <div className="mx-auto">
      {/* Wrap children in Suspense for lazy loading support */}
      <Suspense fallback={<BarLoader width={"100%"} color="#36d7b7" />}>
        {children} {/* Render page content here */}
      </Suspense>
    </div>
  );
}