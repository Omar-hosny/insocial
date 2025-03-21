"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { getCurrentUser } from "./auth.actions";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();
// import { redirect } from "next/navigation";

const postSchema = z.object({
  content: z.string().min(1).max(280).optional(),
  image: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024, // 5MB limit
      { message: "Image must be less than 5MB" }
    )
    .refine(
      (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
      { message: "Only JPEG, PNG and GIF images are allowed" }
    )
    .optional()
    .or(z.string().optional()),
  // .or(z.null().optional()),
});

// export type postFormType = {
//   errors?: Record<string, string[]>;
//   prevData?: {
//     image?: string | File;
//     content?: string;
//   };
// };
export type postFormType = {
  errors?: Record<string, string[]>;
  prevData?: {
    image?: string | File;
    content?: string;
  };
};
export async function createPost(
  prevData: postFormType | undefined,
  formData: FormData
): Promise<postFormType | undefined> {
  const content = formData.get("content") as string;
  const imageFile = formData.get("image") as File;
  let imageUrl = "";

  if (imageFile && imageFile.size > 0) {
    try {
      const uploadResponse = await utapi.uploadFiles(imageFile);
      if (!uploadResponse || !uploadResponse.data) {
        return {
          errors: { image: ["Failed to upload image"] },
          prevData: { content },
        };
      }
      imageUrl = uploadResponse.data.ufsUrl;
    } catch (error) {
      console.log(error);
      return {
        errors: { image: ["Error uploading image"] },
        prevData: { content },
      };
    }
  }

  // validate post data
  const result = postSchema.safeParse({
    content,
    image: imageUrl,
  });
  // check if validation failed
  if (!result.success) {
    console.log(result.error.flatten().fieldErrors);
    return {
      errors: result.error.flatten().fieldErrors,
      prevData: {
        content,
      },
    };
  }

  const user = await getCurrentUser();
  if (!user || !user.id) {
    return {
      errors: {
        content: ["You must be logged in to create a post"],
      },
      prevData: {
        content,
      },
    };
  }
  //   create post if success
  const post = await prisma.post.create({
    data: {
      content: content,
      image: imageUrl,
      author: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  console.log(post);
  revalidatePath("/");
}

// get all posts by user id
export async function getPosts() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const posts = await prisma.post.findMany({
      where: {
        OR: [
          {
            author: {
              followers: {
                some: {
                  followerId: currentUser.id,
                },
              },
            },
          },
          {
            authorId: currentUser.id,
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });

    return posts;
  } catch (error) {
    console.log("Error in getPosts", error);
    throw new Error("Failed to fetch posts");
  }
}

// get user posts by username
export async function getUserPosts(username: string) {
  try {
    if (!username) {
      throw new Error("User not found");
    }
    const posts = await prisma.post.findMany({
      where: {
        author: {
          username: username,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
            username: true,
          },
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                image: true,
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        likes: {
          select: {
            userId: true,
          },
        },
        _count: {
          select: {
            likes: true,
            comments: true,
          },
        },
      },
    });
    return posts;
  } catch (error) {
    console.log(error);
  }
}
