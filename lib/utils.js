// lib/utils.js

// Utility function to combine class names safely
// Uses `clsx` to conditionally join class names
// Uses `tailwind-merge` to intelligently merge conflicting Tailwind classes

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines class names using clsx and resolves Tailwind conflicts using tailwind-merge.
 *
 * @param  {...any} inputs - Class name strings, objects, arrays, etc.
 * @returns {string} - Final merged className string
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}