// lib/auth-options.ts
import getServerSession from "next-auth";
import authConfig from "@/auth.config";

export const authOptions = {
  ...authConfig,
  // Add any additional server-side options here
};

export const getAuthSession = () => getServerSession(authOptions);
