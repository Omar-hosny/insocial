import { NextRequest, NextResponse } from "next/server";
import { getSessionData } from "./lib/session";

// public and private routes
const publicRoutes = ["/login", "/register"];
const privateRoutes = ["/"];
// middleware function
export default async function middleware(request: NextRequest) {
  //   get the route from the request
  const path = request.nextUrl.pathname;

  //  check if the route is public or private
  // check if the path is protected
  const isPublicRoute = publicRoutes.includes(path);
  const isPrivateRoute = privateRoutes.includes(path);

  // check if the user is authenticated
  const session = await getSessionData();
  // if the route is public and the user is authenticated, redirect to the home page
  if (isPublicRoute && session?.userId) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  // if the route is private and the user is not authenticated, redirect to the login page
  if (isPrivateRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  //   return the NextResponse
  return NextResponse.next();
}

export const config = {
  matcher: [
    // match all routes
    "/(.*)",
  ],
};
