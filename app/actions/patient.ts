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

export async function duplicatePatientAction(id: string) {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id },
      include: {
        assessments: true,
        resumes: true,
        cppts: true,
        labResults: true,
        observations: true,
      }
    });

    if (!patient) {
      return { error: "Pasien tidak ditemukan" };
    }

    const duplicatedPatient = await prisma.$transaction(async (tx) => {
      const { 
        id: _, 
        createdAt, 
        updatedAt, 
        assessments, 
        resumes, 
        cppts, 
        labResults, 
        observations, 
        ...patientData 
      } = patient;
      
      // Generate unique random suffix for noRm to avoid uniqueness conflict
      const suffix = Math.floor(1000 + Math.random() * 9000).toString();

      const newPatient = await tx.patient.create({
        data: {
          ...patientData,
          nama: `${patientData.nama} (DUPLICATE)`,
          noRm: `${patientData.noRm}-COPY-${suffix}`,
        },
      });

      const newPatientId = newPatient.id;

      if (assessments && assessments.length > 0) {
        await tx.initialAssessment.createMany({
          data: assessments.map((a) => ({
            patientId: newPatientId,
            data: a.data as any,
          })),
        });
      }

      if (resumes && resumes.length > 0) {
        await tx.resume.createMany({
          data: resumes.map((r) => ({
            patientId: newPatientId,
            data: r.data as any,
          })),
        });
      }

      if (cppts && cppts.length > 0) {
        await tx.cppt.createMany({
          data: cppts.map((c) => ({
            patientId: newPatientId,
            tanggal: c.tanggal,
            waktu: c.waktu,
            subjektif: c.subjektif,
            objektif: c.objektif,
            assessment: c.assessment,
            planning: c.planning,
          })),
        });
      }

      if (labResults && labResults.length > 0) {
        await tx.labResult.createMany({
          data: labResults.map((l) => ({
            patientId: newPatientId,
            tanggal: l.tanggal,
            files: l.files,
          })),
        });
      }

      if (observations && observations.length > 0) {
        await tx.observation.createMany({
          data: observations.map((o) => ({
            patientId: newPatientId,
            userId: o.userId,
            tanggal: o.tanggal,
            nadi: o.nadi,
            tensi: o.tensi,
            rr: o.rr,
            suhu: o.suhu,
            spo2: o.spo2,
            nrs: o.nrs,
            gcs: o.gcs,
            pupil: o.pupil,
            ews: o.ews,
            cm: o.cm,
            ck: o.ck,
            balans: o.balans,
            balansStart: o.balansStart,
            keistimewaan: o.keistimewaan,
          })),
        });
      }

      return newPatient;
    });

    await logAudit("CREATE", "Patient", duplicatedPatient.id, duplicatedPatient);
    
    revalidatePath("/");
    return { success: true, newId: duplicatedPatient.id };
  } catch (error: any) {
    return {
      error: error.message || "Gagal menduplikasi pasien beserta rekam medisnya",
    };
  }
}
