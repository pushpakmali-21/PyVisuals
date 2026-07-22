import type { Metadata } from "next";
import { SignUpPage } from "@/components/auth/SignUpPage";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a free PyVisuals account to save your Python learning progress.",
};

export default function SignUpRoute() {
  return <SignUpPage />;
}
