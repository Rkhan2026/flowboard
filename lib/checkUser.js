/**
 * lib/checkUser.js
 *
 * Purpose:
 * This function checks whether the current signed-in Clerk user exists in your database.
 * If the user doesn't exist, it creates a new one using data from Clerk.
 * This keeps your local `User` table in sync with Clerk's authentication.
 */

import { currentUser } from "@clerk/nextjs/server"; // Gets the currently authenticated Clerk user
import { db } from "@/lib/prisma"; // Prisma client to interact with your database

export const checkUser = async () => {
  // Get the current user from Clerk
  const user = await currentUser();

  // If there's no signed-in user, just return null
  if (!user) {
    return null;
  }

  try {
    // Try to find this user in your database using their Clerk ID
    const loggedInUser = await db?.user.findUnique({
      where: {
        clerkUserId: user.id, // Clerk user ID is stored in the DB for lookup
      },
    });

    // If the user is found, return the existing DB record
    if (loggedInUser) {
      return loggedInUser;
    }

    // If not found, prepare the full name (firstName and lastName may be optional)
    const name = `${user.firstName} ${user.lastName}`;

    // Create a new user record in the database using Clerk data
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id, // Save Clerk user ID for future lookups
        name,                 // Full name
        imageUrl: user.imageUrl, // Profile image URL
        email: user.emailAddresses[0].emailAddress, // Use the first email address
      },
    });

    // Return the newly created user
    return newUser;
  } catch (error) {
    // Log any error that happens during DB operations
    console.log("Error checking/creating user:", error);
    return null;
  }
};