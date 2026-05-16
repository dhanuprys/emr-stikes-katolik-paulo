"use server";

import { loginSchema } from "@/lib/validations/auth";
import { login, logout } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function loginAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const validatedFields = loginSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    await login(validatedFields.data);
  } catch (error: any) {
    return {
      error: error.message || "Gagal masuk",
    };
  }

  redirect("/");
}

export async function logoutAction() {
  await logout();
  redirect("/login");
}
