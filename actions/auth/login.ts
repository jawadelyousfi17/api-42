"use server";

import { signIn } from "@/lib/auth/auth-provider";

export async function loginAction() {
  await signIn("42-school", { redirectTo: "/preference" });
}
