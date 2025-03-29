/**
 * app/layout.js or components/RootLayout.js
 *
 * Purpose:
 * This is the root layout component used by Next.js (App Router).
 * It wraps the entire application and handles:
 * - Global styles and fonts
 * - Clerk authentication context
 * - Dark/light theme support
 * - Header, footer, and layout structure
 * - Toaster notifications
 */

import { Inter } from "next/font/google"; // Import the Inter font from Google Fonts
import "./globals.css"; // Global Tailwind styles

import { ThemeProvider } from "@/components/theme-provider"; // Dark/light theme context
import Header from "@/components/header"; // Top navigation/header bar
import { ClerkProvider } from "@clerk/nextjs"; // Clerk provider for authentication
import "react-day-picker/dist/style.css"; // Styles for date picker components
import { Toaster } from "sonner"; // Toast notifications (like success/error messages)

// Load the Inter font and apply it globally
const inter = Inter({ subsets: ["latin"] });

// Metadata for the site (used by Next.js for SEO)
export const metadata = {
  title: "FlowBoard",       // Default tab title
  description: "",          // Meta description (optional)
};

// Root layout component
export default function RootLayout({ children }) {
  return (
    // Wrap the whole app in ClerkProvider to enable auth
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} animated-dotted-background`}>
          {/* ThemeProvider enables dark/light mode via Tailwind */}
          <ThemeProvider attribute="class" defaultTheme="dark">
            
            {/* App header (navigation bar, logo, etc.) */}
            <Header />

            {/* Main content of the app (dynamically injected pages/components) */}
            <main className="min-h-screen">{children}</main>

            {/* Global toast notification component */}
            <Toaster richColors />

            {/* Footer displayed on all pages */}
            <footer className="bg-gray-900 py-12">
              <div className="container mx-auto px-4 text-center text-gray-200">
                <p>Made By Rkhan2026</p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}