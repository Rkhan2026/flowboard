"use server";

import { db } from "@/lib/prisma";
import { auth, clerkClient } from "@clerk/nextjs/server";
import type { Organization, OrganizationMembership } from "@clerk/nextjs/server";

export async function getOrganization(slug: string): Promise<Organization | null> {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Get the organization details
  const client = await clerkClient(); // call the function
  const organization = await client.organizations.getOrganization({ slug });

  if (!organization) {
    return null;
  }

  // Get list of members in the organization
  const { data: membership }: { data: OrganizationMembership[] } =
    await client.organizations.getOrganizationMembershipList({
      organizationId: organization.id,
    });

  const userMembership = membership.find(
    (member: OrganizationMembership) => member.publicUserData?.userId === userId
  );

  if (!userMembership) {
    return null;
  }

  return organization;
}