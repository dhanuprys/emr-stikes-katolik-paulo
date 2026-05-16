"use server";

import { prisma } from "@/lib/prisma";
import { patientSchema } from "@/lib/validations/patient";
import { logAudit } from "@/lib/audit";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createPatientAction(prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const validatedFields = patientSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Gagal menyimpan data pasien. Periksa kembali form anda.",
    };
  }

  try {
    const existingRm = await prisma.patient.findUnique({
      where: { noRm: validatedFields.data.noRm },
    });

    if (existingRm) {
      return {
        message: "No. RM sudah terdaftar di sistem.",
      };
    }

    // Convert date string to ISO
    const payload = {
      ...validatedFields.data,
      tanggalMasuk: new Date(validatedFields.data.tanggalMasuk),
      tanggalLahir: new Date(validatedFields.data.tanggalLahir),
      tanggalKeluar: validatedFields.data.tanggalKeluar ? new Date(validatedFields.data.tanggalKeluar) : null,
      tanggalMeninggal: validatedFields.data.tanggalMeninggal ? new Date(validatedFields.data.tanggalMeninggal) : null,
    };

    const patient = await prisma.patient.create({
      data: payload,
    });

    await logAudit("CREATE", "Patient", patient.id, patient);

  } catch (error: any) {
    return {
      message: error.message || "Gagal membuat pasien",
    };
  }

  revalidatePath("/");
  redirect("/");
}

export async function updatePatientAction(id: string, prevState: any, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  
  const validatedFields = patientSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Gagal menyimpan data pasien. Periksa kembali form anda.",
    };
  }

  try {
    const existingRm = await prisma.patient.findUnique({
      where: { noRm: validatedFields.data.noRm },
    });

    if (existingRm && existingRm.id !== id) {
      return {
        message: "No. RM sudah terdaftar untuk pasien lain.",
      };
    }

    const payload = {
      ...validatedFields.data,
      tanggalMasuk: new Date(validatedFields.data.tanggalMasuk),
      tanggalLahir: new Date(validatedFields.data.tanggalLahir),
      tanggalKeluar: validatedFields.data.tanggalKeluar ? new Date(validatedFields.data.tanggalKeluar) : null,
      tanggalMeninggal: validatedFields.data.tanggalMeninggal ? new Date(validatedFields.data.tanggalMeninggal) : null,
    };

    const patient = await prisma.patient.update({
      where: { id },
      data: payload,
    });

    await logAudit("UPDATE", "Patient", patient.id, patient);

  } catch (error: any) {
    return {
      message: error.message || "Gagal mengupdate pasien",
    };
  }

  revalidatePath(`/patient/${id}`);
  revalidatePath("/");
  redirect(`/patient/${id}`);
}

export async function deletePatientAction(id: string) {
  try {
    const labs = await prisma.labResult.findMany({ where: { patientId: id } });
    
    // Clean up physical lab files
    for (const lab of labs) {
      for (const filePath of lab.files) {
        const { join } = require("path");
        const { existsSync } = require("fs");
        const { unlink } = require("fs/promises");
        
        const localPath = join(process.cwd(), "public", filePath);
        try {
          if (existsSync(localPath)) {
            await unlink(localPath);
          }
        } catch (err) {
          console.error("Failed to delete lab file:", localPath, err);
        }
      }
    }

    const patient = await prisma.patient.delete({ where: { id } });
    await logAudit("DELETE", "Patient", id, patient);
    
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Delete patient error:", error);
    return { error: error.message || "Gagal menghapus pasien" };
  }
}
