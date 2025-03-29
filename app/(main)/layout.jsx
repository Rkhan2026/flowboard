/**
 * components/Layout.js
 *
 * Purpose:
 * A reusable layout component that wraps page content inside a centered container
 * with consistent margin and padding. Useful for standardizing layout across pages.
 *
 * Often used for content sections like dashboards, forms, or detail views.
 */

import React from "react";

// Main Layout component
const Layout = ({ children }) => {
  return (
    // Container centers the content, adds top margin and horizontal padding
    <div className="container mx-auto mt-5 px-4">
      {children} {/* Render any children passed into the layout */}
    </div>
  );
};

export default Layout; // Export for use in pages or nested layouts