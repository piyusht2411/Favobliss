// middleware.ts
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  privateRoutes,
  publicRoutes, // Make sure this is defined
} from "@/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPrivateRoute = privateRoutes.some((route) =>
    nextUrl.pathname.startsWith(route)
  );
  const isPublicRoute =
    publicRoutes.includes(nextUrl.pathname) ||
    publicRoutes.some((route) => nextUrl.pathname.startsWith(route));

  // Allow API auth routes and public routes
  if (isApiAuthRoute || isPublicRoute) {
    return null;
  }

  // Handle auth routes
  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // Redirect unauthenticated users from private routes
  if (!isLoggedIn && isPrivateRoute) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const redirectUrl = new URL("/login", nextUrl);
    redirectUrl.searchParams.set("callbackUrl", callbackUrl);

    return Response.redirect(redirectUrl);
  }

  return null;
});

// Update matcher configuration
export const config = {
  matcher: [
    // Exclude static files and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico|api/auth).*)",
  ],
};
