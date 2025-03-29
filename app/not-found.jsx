/**
 * app/not-found.js
 *
 * Purpose:
 * This is the custom 404 page for your Next.js application.
 * It displays a styled message when a user visits a route that doesn’t exist.
 */

export default function NotFound() {
  return (
    // Full-screen container with centered text and padding from the top
    <div className="text-4xl font-extrabold w-screen pt-96 grid place-items-center">
      <h1>404 - Page Not Found</h1> {/* Main error message */}
    </div>
  );
}