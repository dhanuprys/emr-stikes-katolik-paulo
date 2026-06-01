"use server";

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { revalidatePath } from "next/cache";

export async function getResumeAction(patientId: string) {
  return await prisma.resume.findUnique({
    where: { patientId },
  });
}

/**
 * Compute the nearest future kontrol date from a jadwalKontrol array.
 * Returns a Date if found, or null.
 */
function computeNearestKontrol(jadwalKontrol: any[]): Date | null {
  if (!Array.isArray(jadwalKontrol) || jadwalKontrol.length === 0) return null;

  const now = new Date();
  let nearest: Date | null = null;

  for (const entry of jadwalKontrol) {
    if (!entry.tanggal) continue;
    try {
      const d = new Date(entry.tanggal);
      if (isNaN(d.getTime())) continue;
      // Only consider future or today's dates
      if (d >= new Date(now.getFullYear(), now.getMonth(), now.getDate())) {
        if (!nearest || d < nearest) {
          nearest = d;
        }
      }
    } catch {
      continue;
    }
  }

  return nearest;
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

    // Sync computed fields to Patient model
    const updateData: any = {};

    // Compute the nearest future control date from jadwalKontrol array
    const jadwalKontrol = data.jadwalKontrol || [];
    updateData.tanggalKontrolTerdekat = computeNearestKontrol(jadwalKontrol);

    // Also store the jadwalKontrol array on the Patient for display
    updateData.jadwalKontrol = jadwalKontrol.map((entry: any) => ({
      tanggal: entry.tanggal || "",
      dokter: entry.dokter || "",
      alamat: entry.alamat || "",
    }));

    if (data.resumeTglKeluar !== undefined) {
      updateData.tanggalKeluar = data.resumeTglKeluar ? new Date(data.resumeTglKeluar) : null;
    }

    await prisma.patient.update({
      where: { id: patientId },
      data: updateData,
    });

    await logAudit("UPDATE", "Resume", resume.id, { saved: true });

    revalidatePath(`/patient/${patientId}/resume`);
    return { success: true };
  } catch (error: any) {
    console.error("Resume autosave error:", error);
    return { success: false, error: error.message };
  }
}
