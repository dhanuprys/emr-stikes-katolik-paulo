"use server";

import { prisma } from "@/lib/prisma";
import { cpptSchema } from "@/lib/validations/cppt";
import { logAudit } from "@/lib/audit";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function checkCpptExistsAction(patientId: string, tanggalStr: string, waktu: string) {
  // Extract just the YYYY-MM-DD to find matching day
  const targetDate = new Date(tanggalStr);
  const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

  const existing = await prisma.cppt.findFirst({
    where: {
      patientId,
      waktu,
      tanggal: {
        gte: startOfDay,
        lte: endOfDay,
      }
    }
  });

  return existing;
}

export async function getCpptByIdAction(id: string) {
  return await prisma.cppt.findUnique({ where: { id } });
}

export async function saveCpptAction(patientId: string, editingId: string | null, prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());

  const validatedFields = cpptSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Gagal menyimpan Catatan Timbang Terima. Periksa kembali form anda.",
    };
  }

  try {
    const inputData = {
      ...validatedFields.data,
      tanggal: new Date(validatedFields.data.tanggal),
      patientId,
    };

    let cppt;
    if (editingId) {
      cppt = await prisma.cppt.update({
        where: { id: editingId },
        data: inputData,
      });
      await logAudit("UPDATE", "Cppt", cppt.id, cppt);
    } else {
      cppt = await prisma.cppt.create({
        data: inputData,
      });
      await logAudit("CREATE", "Cppt", cppt.id, cppt);
    }
  } catch (error: any) {
    return {
      message: error.message || "Gagal menyimpan Catatan Timbang Terima",
    };
  }

  revalidatePath(`/patient/${patientId}/cppt`);
  redirect(`/patient/${patientId}/cppt`);
}

export async function deleteCpptAction(id: string) {
  try {
    const cppt = await prisma.cppt.delete({ where: { id } });
    await logAudit("DELETE", "Cppt", id, cppt);
    revalidatePath(`/patient/${cppt.patientId}/cppt`);
    return { success: true };
  } catch (error: any) {
    console.error("Delete Catatan Timbang Terima error:", error);
    return { error: error.message || "Gagal menghapus catatan Timbang Terima" };
  }
}
