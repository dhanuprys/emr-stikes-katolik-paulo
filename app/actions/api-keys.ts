"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getApiKeys() {
  return await prisma.apiKey.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function addApiKeyAction(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const key = formData.get("key") as string;
  const provider = formData.get("provider") as string || "gemini";

  if (!name || !key) {
    return { message: "Nama dan API Key wajib diisi." };
  }

  await prisma.apiKey.create({
    data: { name, key, provider },
  });

  revalidatePath("/settings/api-keys");
  return { success: true };
}

export async function toggleApiKeyAction(id: string) {
  const existing = await prisma.apiKey.findUnique({ where: { id } });
  if (!existing) return;

  await prisma.apiKey.update({
    where: { id },
    data: { isActive: !existing.isActive },
  });

  revalidatePath("/settings/api-keys");
}

export async function deleteApiKeyAction(id: string) {
  await prisma.apiKey.delete({ where: { id } });
  revalidatePath("/settings/api-keys");
}

/**
 * Get the next available Gemini API key using round-robin by usage count.
 * Picks the active key with the lowest usage count.
 */
export async function getNextGeminiKey(): Promise<string | null> {
  const key = await prisma.apiKey.findFirst({
    where: {
      provider: "gemini",
      isActive: true,
    },
    orderBy: { usageCount: "asc" },
  });

  if (!key) return null;

  // Increment usage
  await prisma.apiKey.update({
    where: { id: key.id },
    data: { usageCount: { increment: 1 } },
  });

  return key.key;
}
