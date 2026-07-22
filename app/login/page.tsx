import type { Metadata } from "next";
import { LoginPage } from "@/components/auth/LoginPage";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your PyVisuals account to track your Python learning progress.",
};

export default function LoginRoute() {
  return <LoginPage />;
}
