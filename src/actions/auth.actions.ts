"use server";
// Auth actions

import { prisma } from "@/lib/prisma";
import { createSession, deleteSession, getSessionData } from "@/lib/session";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { z } from "zod";

// login schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address").trim(),
  password: z.string().min(6, "Password must be at least 6 characters").trim(),
});

//  register schema
const registerSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters").trim(),
    email: z.string().email("Invalid email addess").trim(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .trim(),
    confirmPassword: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// login state type
export type loginState = {
  errors?: Record<string, string[]>;
  prevData?: {
    name?: string;
    email?: string;
  };
};
// login action
export async function login(
  prevData: loginState,
  formData: FormData
): Promise<loginState> {
  // geting the form data
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  // validating the form data
  const result = loginSchema.safeParse({
    email,
    password,
  });

  // if validation fails
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      prevData: { email },
    };
  }
  // if validation succeeds check if user exists
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  // if user not found
  if (!user) {
    return {
      errors: { email: ["User not found"] },
      prevData: { email },
    };
  }

  // if user found check if password is correct using bcrypt compare with stored hash in the database
  const isValidPassword = await bcrypt.compare(password, user.password);
  // if password is not correct
  if (!isValidPassword) {
    return {
      errors: { password: ["Invalid email or password"] },
      prevData: { email },
    };
  }

  // if password is correct create a session and redirect to home
  await createSession(user.id);
  redirect("/");
}

// register state type
export type registerState = {
  errors?: Record<string, string[]>;
  prevData?: {
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  };
};

// register action
export async function register(
  prevData: registerState,
  formData: FormData
): Promise<registerState> {
  // get form data
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  // validate form data
  const result = registerSchema.safeParse({
    name: name,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  });

  // check if form data is valid
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
      prevData: { name, email },
    } satisfies registerState;
  }
  // check if user exists
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  // if user exists
  if (existingUser) {
    return {
      errors: { email: ["email already exists"] },
      prevData: { name, email },
    } satisfies registerState;
  }
  // if user does not exist create a new user
  // hash the password
  const hashedPassword = await bcrypt.hash(password, 10);
  // create a new user
  const user = await prisma.user.create({
    data: {
      username: name.trim().replace(/\s+/g, ""),
      name,
      email,
      password: hashedPassword,
      image: "/profile.png",
    },
  });

  // create a session and redirect to home
  await createSession(user.id);
  redirect("/");
}

// get the current logged in user data
export async function getCurrentUser() {
  // get the current session data
  const sessionData = await getSessionData();

  // check id no session data
  if (!sessionData || !sessionData.userId) return;
  // get the user data
  const user = await prisma.user.findUnique({
    where: {
      id: sessionData.userId,
    },
    select: {
      name: true,
      email: true,
      username: true,
      image: true,
      bio: true,
      id: true,
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  });
  return user;
}

// logout action function
export async function logout() {
  // delete session
  await deleteSession();
  redirect("/login");
}
