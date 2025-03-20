"use client";
import Link from "next/link";
import { useActionState } from "react";
import { Input } from "./ui/input";
import { register } from "@/actions/auth.actions";
import SubmitBtn from "./SubmitBtn";

export default function RegisterForm() {
  const [state, registerAction] = useActionState(register, {
    errors: {},
    prevData: {},
  });

  return (
    <div
      className="mx-auto max-w-2xl flex flex-col items-center  
     border rounded-2xl mt-20 p-4"
    >
      <div className="flex min-h-full w-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1 className="text-3xl italic text-center mb-2">InSocial</h1>
          <h2 className="mt-5 text-center text-2xl/9  tracking-tight text-gray-500dark:text-gray-400">
            Create your account
          </h2>
        </div>

        <>
          <form
            action={registerAction}
            className="space-y-6  mt-10 w-full flex flex-col"
          >
            <div className="w-full flex flex-col gap-1 ">
              <label
                htmlFor="name"
                className="block  text-gray-900 dark:text-white"
              >
                Name
              </label>

              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your Name"
                defaultValue={state.prevData?.name ?? ""}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              {state.errors?.name && (
                <p className="text-red-500 text-sm">{state.errors?.name}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-1 ">
              <label
                htmlFor="email"
                className="block  text-gray-900 dark:text-white"
              >
                Email address
              </label>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="name@example.com"
                defaultValue={state.prevData?.email ?? ""}
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />
              {state.errors?.email && (
                <p className="text-red-500 text-sm">{state.errors?.email}</p>
              )}
            </div>

            <div className="w-full flex flex-col gap-1 ">
              <label
                htmlFor="password"
                className="block  text-gray-900 dark:text-white"
              >
                Password
              </label>

              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />

              {state.errors?.password && (
                <p className="text-red-500 text-sm">{state.errors?.password}</p>
              )}
            </div>
            <div className="w-full flex flex-col gap-1 ">
              <label
                htmlFor="confirmPassword"
                className="block  text-gray-900 dark:text-white"
              >
                Confirm Password
              </label>

              <Input
                id="passwoconfirmPasswordrd"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                autoComplete="current-password"
                className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
              />

              {state.errors?.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {state.errors?.confirmPassword}
                </p>
              )}
            </div>

            <div>
              <SubmitBtn text="sign up" />
            </div>
          </form>

          <p className="mt-10 text-center text-sm/6 text-gray-500 gap-1 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400"
            >
              Login
            </Link>
          </p>
        </>
      </div>
    </div>
  );
}
