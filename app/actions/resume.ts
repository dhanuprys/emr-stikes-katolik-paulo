"use server";

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function getResumeAction(patientId: string) {
  return await prisma.resume.findUnique({
    where: { patientId },
  });
}

// Action for autosave
export async function saveResumeAction(patientId: string, data: any) {
  try {
    const resume = await prisma.resume.upsert({
      where: { patientId },
      update: {
        data,
      },
      create: {
        patientId,
        data,
      },
    });

    await logAudit("UPDATE", "Resume", resume.id, { saved: true });

    revalidatePath(`/patient/${patientId}/resume`);
    return { success: true };
  } catch (error: any) {
    console.error("Resume autosave error:", error);
    return { success: false, error: error.message };
  }
}
