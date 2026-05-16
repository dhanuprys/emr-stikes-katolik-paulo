"use server";

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function getAssessmentAction(patientId: string) {
  return await prisma.initialAssessment.findUnique({
    where: { patientId },
  });
}

// Action for autosave
export async function saveAssessmentAction(patientId: string, data: any) {
  try {
    const assessment = await prisma.initialAssessment.upsert({
      where: { patientId },
      update: {
        data,
      },
      create: {
        patientId,
        data,
      },
    });

    await logAudit("UPDATE", "InitialAssessment", assessment.id, { saved: true });

    revalidatePath(`/patient/${patientId}/assessment`);
    return { success: true };
  } catch (error: any) {
    console.error("Autosave error:", error);
    return { success: false, error: error.message };
  }
}
