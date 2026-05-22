"use server";

import { prisma } from "@/lib/prisma";
import { observationSchema } from "@/lib/validations/observation";
import { logAudit } from "@/lib/audit";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function saveObservationAction(patientId: string, editingId: string | null, prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { message: "Unauthorized. Sesi telah berakhir." };
  }

  // Parse arrays (CM and CK) from FormData if they were stringified, or we can expect them from the client action payload.
  // Actually, since we're using React Hook Form with complex nested arrays, the form submission via FormData is tricky.
  // We should extract the data directly if this is called as a server action with a JSON payload, 
  // OR we parse the formData if it's sent traditionally.
  // But wait, the standard Next.js form action receives FormData.
  // With `useFieldArray`, fields are named `cm.0.jenis`, `cm.0.jumlah`, etc.
  // Let's parse it correctly or just accept a JSON payload if we bypass traditional form action.
  // Wait, Zod `safeParse` works on standard objects. Let's just assume we pass JSON directly to a server action wrapper instead of formData to make arrays easy.
  
  // Wait, let's keep the standard signature but we'll accept a raw object from the client instead of FormData for complex nested data.
  // Wait, Next.js useActionState expects `(prevState, formData)`.
  // Parsing `cm.0.jenis` from FormData is tedious. Let's just create an action that accepts JSON.
  return { message: "Invalid route, use JSON action" };
}

// Since Observation has complex nested arrays, we will use a direct async function (not useActionState) to save.
export async function saveObservationJsonAction(patientId: string, editingId: string | null, data: any) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized. Sesi telah berakhir." };
  }

  const validatedFields = observationSchema.safeParse(data);
  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Data tidak valid. Periksa kembali form anda.",
    };
  }

  try {
    const payload = {
      ...validatedFields.data,
      userId: session.userId,
      tanggal: new Date(validatedFields.data.tanggal),
      balansStart: validatedFields.data.balansStart ? new Date(validatedFields.data.balansStart) : null,
    };

    let observation;
    if (editingId) {
      observation = await prisma.observation.update({
        where: { id: editingId },
        data: payload,
      });
      await logAudit("UPDATE", "Observation" as any, observation.id, observation);
    } else {
      observation = await prisma.observation.create({
        data: {
          ...payload,
          patientId,
        },
      });
      await logAudit("CREATE", "Observation" as any, observation.id, observation);
    }

    revalidatePath(`/patient/${patientId}/observation`);
    return { success: true, id: observation.id };
  } catch (error: any) {
    console.error("Save observation error:", error);
    return { success: false, message: error.message || "Gagal menyimpan observasi" };
  }
}

export async function getObservationByIdAction(id: string) {
  return await prisma.observation.findUnique({
    where: { id },
  });
}

export async function deleteObservationAction(id: string) {
  const session = await getSession();
  if (!session) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const obs = await prisma.observation.delete({ where: { id } });
    await logAudit("DELETE", "Observation" as any, id, obs);
    revalidatePath(`/patient/${obs.patientId}/observation`);
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || "Gagal menghapus" };
  }
}

export async function calculateBalansAction(patientId: string, startDateStr: string, endDateStr: string) {
  try {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);

    const observations = await prisma.observation.findMany({
      where: {
        patientId,
        tanggal: {
          gte: start,
          lte: end,
        }
      },
      select: {
        cm: true,
        ck: true,
      }
    });

    let totalCM = 0;
    let totalCK = 0;

    observations.forEach(obs => {
      obs.cm.forEach(item => {
        totalCM += item.jumlah;
      });
      obs.ck.forEach(item => {
        totalCK += item.jumlah;
      });
    });

    return { success: true, balans: totalCM - totalCK, totalCM, totalCK };
  } catch (error: any) {
    console.error("Calculate balans error:", error);
    return { success: false, message: error.message || "Gagal mengkalkulasi balans" };
  }
}
