"use client"; 
// This is a Client Component because it uses state, effects, forms, and interactivity

/**
 * app/project/create/page.js
 *
 * Purpose:
 * This page allows org admins to create a new project.
 * - Uses react-hook-form with Zod validation
 * - Displays a form for project name, key, and description
 * - Handles project creation with Clerk and server-side actions
 * - Only users with "org:admin" role can access this page
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Hook-based form state
import { zodResolver } from "@hookform/resolvers/zod"; // Resolver to connect Zod validation
import { useRouter } from "next/navigation";
import { useOrganization, useUser } from "@clerk/nextjs"; // Clerk hooks for user/org info
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch"; // Custom hook for API handling
import { projectSchema } from "@/app/lib/validators"; // Zod schema for validation
import { createProject } from "@/actions/projects"; // Server action to create project
import { BarLoader } from "react-spinners"; // Loading indicator
import OrgSwitcher from "@/components/org-switcher"; // Switch between orgs

export default function CreateProjectPage() {
  const router = useRouter();
  const { isLoaded: isOrgLoaded, membership } = useOrganization();
  const { isLoaded: isUserLoaded } = useUser();

  const [isAdmin, setIsAdmin] = useState(false); // Tracks if user is an org admin

  // Initialize form with validation schema
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),
  });

  // Check if user is an org admin
  useEffect(() => {
    if (isOrgLoaded && isUserLoaded && membership) {
      setIsAdmin(membership.role === "org:admin");
    }
  }, [isOrgLoaded, isUserLoaded, membership]);

  // Handle project creation request
  const {
    loading,
    error,
    data: project,
    fn: createProjectFn,
  } = useFetch(createProject);

  // Handle form submission
  const onSubmit = async (data) => {
    if (!isAdmin) {
      alert("Only organization admins can create projects");
      return;
    }
    createProjectFn(data);
  };

  // Redirect to the new project page after creation
  useEffect(() => {
    if (project) {
      router.push(`/project/${project.id}`);
    }
  }, [loading]);

  // Don’t render form until user and org are loaded
  if (!isOrgLoaded || !isUserLoaded) {
    return null;
  }

  // If user is not an admin, show a message and org switcher
  if (!isAdmin) {
    return (
      <div className="flex flex-col gap-2 items-center">
        <span className="text-2xl gradient-title">
          Oops! Only Admins can create projects.
        </span>
        <OrgSwitcher />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-6xl text-center font-bold mb-8 gradient-title">
        Create New Project
      </h1>

      {/* Project creation form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        {/* Project Name */}
        <div>
          <Input
            id="name"
            {...register("name")}
            className="bg-slate-950"
            placeholder="Project Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Project Key */}
        <div>
          <Input
            id="key"
            {...register("key")}
            className="bg-slate-950"
            placeholder="Project Key (Ex: RCYT)"
          />
          {errors.key && (
            <p className="text-red-500 text-sm mt-1">{errors.key.message}</p>
          )}
        </div>

        {/* Project Description */}
        <div>
          <Textarea
            id="description"
            {...register("description")}
            className="bg-slate-950 h-28"
            placeholder="Project Description"
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Loader bar while creating */}
        {loading && (
          <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
        )}

        {/* Submit button */}
        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="bg-blue-500 text-white"
        >
          {loading ? "Creating..." : "Create Project"}
        </Button>

        {/* Error display */}
        {error && <p className="text-red-500 mt-2">{error.message}</p>}
      </form>
    </div>
  );
}