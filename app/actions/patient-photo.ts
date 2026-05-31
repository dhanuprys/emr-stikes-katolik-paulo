"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

export async function uploadPatientPhotoAction(patientId: string, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  if (!file) {
    return { success: false, message: "Tidak ada file yang diunggah." };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = join(process.cwd(), "public/uploads/patients");

    // Ensure directory exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Sanitize filename and add timestamp
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const filename = `${Date.now()}-${safeName}`;
    const filepath = join(uploadDir, filename);

    // Write file to disk
    await writeFile(filepath, buffer);

    const photoUrl = `/uploads/patients/${filename}`;

    // Update patient record
    await prisma.patient.update({
      where: { id: patientId },
      data: { photo: photoUrl },
    });

    revalidatePath(`/patient/${patientId}`);
    return { success: true, photoUrl };
  } catch (error: any) {
    console.error("Upload photo error:", error);
    return { success: false, message: "Gagal mengunggah foto." };
  }
}
