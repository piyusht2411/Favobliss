import { LoginForm } from "@/components/auth/forms/login-form";
import { Metadata } from "next";
import getServerSession from "next-auth";
import { redirect } from "next/navigation";
import { getAuthSession } from "./auth-option";

export const metadata: Metadata = {
  title: "Login - Favobliss",
};

const LoginPage = async () => {
  const session = await getAuthSession();
  //@ts-ignore
  if (session?.user) {
    redirect("/");
  }
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default LoginPage;
