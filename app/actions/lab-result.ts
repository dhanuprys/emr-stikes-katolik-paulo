"use server";

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function createLabResultAction(patientId: string, prevState: any, formData: FormData) {
  const tanggal = formData.get("tanggal") as string;
  const files = formData.getAll("files") as File[];

  if (!tanggal || files.length === 0 || files[0].size === 0) {
    return {
      message: "Tanggal dan minimal satu dokumen lab diperlukan",
    };
  }

  try {
    const uploadDir = join(process.cwd(), "public/uploads/lab");
    
    // Create directory if not exists
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    const savedFilePaths: string[] = [];

    // Process each file
    for (const file of files) {
      if (file.size === 0) continue;
      
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const filename = `${uniqueSuffix}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
      const filepath = join(uploadDir, filename);

      await writeFile(filepath, buffer);
      savedFilePaths.push(`/uploads/lab/${filename}`);
    }

    if (savedFilePaths.length === 0) {
      return { message: "Gagal mengupload file dokumen." };
    }

    const labResult = await prisma.labResult.create({
      data: {
        patientId,
        tanggal: new Date(tanggal),
        files: savedFilePaths,
      },
    });

    await logAudit("CREATE", "LabResult", labResult.id, labResult);

  } catch (error: any) {
    console.error("Lab upload error:", error);
    return {
      message: error.message || "Gagal mengunggah hasil lab",
    };
  }

    revalidatePath(`/patient/${patientId}/lab`);
  redirect(`/patient/${patientId}/lab`);
}

export async function deleteLabResultAction(id: string) {
  try {
    const labResult = await prisma.labResult.findUnique({ where: { id } });
    if (!labResult) return { error: "Hasil Lab tidak ditemukan" };

    // Delete physical files
    for (const filePath of labResult.files) {
      // filePath is something like "/uploads/lab/123-file.pdf"
      const localPath = join(process.cwd(), "public", filePath);
      try {
        if (existsSync(localPath)) {
          // need to import unlink from fs/promises
          const { unlink } = require("fs/promises");
          await unlink(localPath);
        }
      } catch (err) {
        console.error("Failed to delete lab file:", localPath, err);
      }
    }

    await prisma.labResult.delete({ where: { id } });
    await logAudit("DELETE", "LabResult", id, labResult);
    
    revalidatePath(`/patient/${labResult.patientId}/lab`);
    return { success: true };
  } catch (error: any) {
    console.error("Delete lab error:", error);
    return { error: error.message || "Gagal menghapus hasil lab" };
  }
}
