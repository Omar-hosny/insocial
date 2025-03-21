"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth.actions";
import { revalidatePath } from "next/cache";

export async function getSuggestionUsers() {
  // Get the current user
  const user = await getCurrentUser();
  if (!user || !user.id) {
    return [];
  }

  // Get up to 3 users that the current user is NOT following
  const suggestionUsers = await prisma.user.findMany({
    where: {
      id: { not: user.id }, // Exclude the current user
      followers: { none: { followerId: user.id } }, // Not followed by current user
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      _count: {
        select: {
          followers: true,
          following: true,
        },
      },
    },
    take: 3, // Limit to 3 users
  });

  return suggestionUsers;
}

// follow user
export async function followUser(followedId: string) {
  try {
    if (!followedId) {
      return {
        error: "No followedId provided to followUser",
        success: false,
        data: null,
      };
    }

    const user = await getCurrentUser();
    if (!user || !user.id) {
      return {
        error: "You must be logged in to follow a user.",
        success: false,
        data: null,
      };
    }

    // Check if already following
    const existingFollow = await prisma.follow.findFirst({
      where: {
        followerId: user.id,
        followingId: followedId,
      },
    });

    if (existingFollow) {
      return {
        error: "You are already following this user.",
        success: false,
        data: null,
      };
    }

    const followedUser = await prisma.user.findUnique({
      where: {
        id: followedId,
      },
    });

    if (!followedUser) {
      return {
        error: "The user you are trying to follow does not exist.",
        success: false,
        data: null,
      };
    }

    const followed = await prisma.follow.create({
      data: {
        followerId: user.id,
        followingId: followedId,
      },
    });
    if (!followed) {
      return {
        error: "Failed to follow user. Please try again.",
        success: false,
        data: null,
      };
    }

    console.log(followed);
    revalidatePath("/");
    return {
      success: true,
      data: "you are now following this user, ",
      error: null,
    };
  } catch (error) {
    console.error("Error in followUser:", error);
    return {
      error: "Failed to follow user. Please try again.",
      success: false,
      data: null,
    };
  }
}
