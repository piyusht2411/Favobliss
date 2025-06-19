export const privateRoutes: string[] = [
  "/orders",
  "/checkout/address",
  "/my/dashboard",
  "/my/profile",
  "/my/address",
];

export const authRoutes = [
  "/login",
  "/registration",
  "/forget",
  "/new-password",
];

export const publicRoutes = [
  "/",
  "/products",
  "/product",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/api/trpc", // Add this if using tRPC
  "/_next", // Add this for Next.js static files
];

export const apiAuthPrefix = "/api";

export const DEFAULT_LOGIN_REDIRECT = "/";
