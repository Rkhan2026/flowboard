"use client"; 
// This directive tells Next.js that this file should run on the client side
// Required because it uses context and interactivity (theme switching)

// --------------------------------------------------------------
// components/ThemeProvider.js
//
// Purpose:
// This component wraps your entire app or layout to enable theme switching
// using the `next-themes` library. It provides a light/dark theme context
// that can be accessed by any component within the tree.
//
// Usage:
// Wrap your root layout or App component with <ThemeProvider>.
// Example themes can be toggled with a switch (light, dark, system).
// --------------------------------------------------------------

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes"; 
// Import the actual provider from the next-themes package

// Re-exported ThemeProvider component
export function ThemeProvider({ children, ...props }) {
  return (
    // Wrap children in NextThemesProvider to enable theme switching across the app
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}