/**
 * components/AuthLayout.js
 *
 * Purpose:
 * A simple layout component used to center auth-related pages
 * like Sign In or Sign Up. It wraps children components in a 
 * flex container with top padding for visual spacing.
 *
 * Commonly used in `app/(auth)/layout.js` to apply to auth routes.
 */

const AuthLayout = ({ children }) => {
  return (
    // Center content horizontally with flex, and add top spacing
    <div className="flex justify-center pt-20">
      {children} {/* This renders the child component passed to the layout */}
    </div>
  );
};

export default AuthLayout; // Export so it can be used in route groups/layouts