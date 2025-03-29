/**
 * hooks/use-fetch.js
 *
 * Purpose:
 * A custom React hook to handle async data fetching with loading and error states.
 * - Wraps any async function (like an API call)
 * - Manages `loading`, `data`, and `error` for you
 * - Shows a toast notification if an error occurs (using `sonner`)
 *
 * How to use:
 * const { data, loading, error, fn } = useFetch(yourAsyncFunction);
 * Then call `fn()` wherever needed.
 */

import { useState } from "react";
import { toast } from "sonner"; // Used to show error notifications

const useFetch = (cb) => {
  const [data, setData] = useState(undefined); // Stores response data
  const [loading, setLoading] = useState(null); // Indicates if request is in progress
  const [error, setError] = useState(null); // Stores any error that occurs

  // The wrapped async function
  const fn = async (...args) => {
    setLoading(true); // Start loading
    setError(null);   // Reset previous errors

    try {
      // Call the original async function with any arguments
      const response = await cb(...args);

      // If successful, save the response data
      setData(response);
      setError(null); // Clear any previous error
    } catch (error) {
      // If an error happens, save it and show a toast
      setError(error);
      toast.error(error.message); // Show error message in toast
    } finally {
      setLoading(false); // Stop loading in any case
    }
  };

  // Return useful state and the async runner function
  return { data, loading, error, fn, setData };
};

export default useFetch;