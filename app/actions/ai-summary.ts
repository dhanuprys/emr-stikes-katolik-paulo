"use server";

import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { GoogleGenAI } from "@google/genai";
import { assessmentSections } from "@/lib/assessment-fields";
import { getNextGeminiKey } from "./api-keys";

const GEMINI_MODEL = "gemini-3.1-flash-lite";

function buildAssessmentText(data: Record<string, any>): string {
  const lines: string[] = [];
  for (const section of assessmentSections) {
    lines.push(`\n### ${section.title}`);
    for (const field of section.fields) {
      const val = data[field.key];
      if (val) {
        lines.push(`- ${field.label}: ${val}${field.suffix ? ` ${field.suffix}` : ""}`);
      }
    }
  }

  // Dynamic lists
  if (data.diagnosaKep?.length) {
    lines.push("\n### Diagnosa Keperawatan");
    data.diagnosaKep.forEach((d: any, i: number) => {
      if (d.diagnosa || d.etiologi) {
        lines.push(`${i + 1}. Diagnosa: ${d.diagnosa || "-"}, Etiologi: ${d.etiologi || "-"}, Prioritas: ${d.prioritas || "-"}`);
      }
    });
  }
  if (data.rencanaKep?.length) {
    lines.push("\n### Rencana Keperawatan — Tujuan");
    data.rencanaKep.forEach((r: any, i: number) => {
      if (r.dp || r.tujuan) {
        lines.push(`${i + 1}. DP: ${r.dp || "-"}, Tujuan: ${r.tujuan || "-"}, Kriteria: ${r.kriteria || "-"}`);
      }
    });
  }
  if (data.intervensiKep?.length) {
    lines.push("\n### Rencana Keperawatan — Intervensi");
    data.intervensiKep.forEach((iv: any, i: number) => {
      if (iv.dp || iv.mandiri) {
        const edukasiStr = [
          ...(Array.isArray(iv.edukasi) ? iv.edukasi : []),
          ...(iv.edukasiLain ? [iv.edukasiLain] : []),
        ].join(", ");
        lines.push(`${i + 1}. DP: ${iv.dp || "-"}, Mandiri: ${iv.mandiri || "-"}, Kolaborasi: ${iv.kolaborasi || "-"}, Edukasi: ${edukasiStr || "-"}`);
      }
    });
  }

  return lines.join("\n");
}

function buildCpptText(cppts: any[]): string {
  if (cppts.length === 0) return "Belum ada catatan CPPT.";

  return cppts.map((c) => {
    const date = new Date(c.tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    return [
      `--- ${date} (Shift ${c.waktu}) ---`,
      `S: ${c.subjektif}`,
      `O: ${c.objektif}`,
      `A: ${c.assessment}`,
      `P: ${c.planning}`,
    ].join("\n");
  }).join("\n\n");
}

export async function getLatestSummary(patientId: string) {
  return await prisma.aiSummary.findFirst({
    where: { patientId },
    orderBy: { createdAt: "desc" },
  });
}

export async function generateAiSummaryAction(patientId: string) {
  // 1. Get API key from rotating pool
  const apiKey = await getNextGeminiKey();
  if (!apiKey) {
    return { error: "Belum ada API Key Gemini yang aktif. Silakan tambahkan di menu Pengaturan > API Keys." };
  }

  // 2. Fetch all data
  const [patient, assessment, cppts] = await Promise.all([
    prisma.patient.findUnique({ where: { id: patientId } }),
    prisma.initialAssessment.findUnique({ where: { patientId } }),
    prisma.cppt.findMany({ where: { patientId }, orderBy: { tanggal: "asc" } }),
  ]);

  if (!patient) {
    return { error: "Pasien tidak ditemukan." };
  }

  // 3. Build context
  const assessmentData = (assessment?.data as Record<string, any>) || {};
  const assessmentText = buildAssessmentText(assessmentData);
  const cpptText = buildCpptText(cppts);

  const patientContext = [
    `Nama: ${patient.nama}`,
    `No. RM: ${patient.noRm}`,
    `Gender: ${patient.gender === "L" ? "Laki-laki" : "Perempuan"}`,
    `Umur: ${patient.umur}`,
    `Tanggal Lahir: ${new Date(patient.tanggalLahir).toLocaleDateString("id-ID")}`,
    `Tanggal Masuk: ${new Date(patient.tanggalMasuk).toLocaleDateString("id-ID")}`,
    `Diagnosa Masuk: ${patient.diagnosaMasuk}`,
    `Jenis Kasus: ${patient.jenisKasus}`,
    `Paviliun: ${patient.paviliun} (${patient.kelas})`,
    `DPJP: ${patient.dokter1}`,
  ].join("\n");

  const prompt = `Anda adalah AI asisten klinis senior di RS Santo Vincentius A Paulo. Anda diminta untuk membuat ringkasan klinis komprehensif berdasarkan data rekam medis elektronik pasien berikut.

## IDENTITAS PASIEN
${patientContext}

## ASESMEN AWAL MEDIS & KEPERAWATAN
${assessmentText}

## CATATAN PERKEMBANGAN PASIEN TERINTEGRASI (Catatan Timbang Terima)
${cpptText}

---

## INSTRUKSI

Buatkan ringkasan klinis **dalam Bahasa Indonesia** yang komprehensif, terstruktur, dan mudah dibaca oleh tenaga medis (dokter dan perawat). Gunakan format Markdown. Ringkasan harus mencakup:

1. **Ringkasan Identitas & Riwayat Pasien**: Ringkas data demografis dan riwayat medis utama pasien.

2. **Temuan Klinis Utama**: Rangkum hasil asesmen awal — temuan fisik yang signifikan, tanda vital, keluhan utama, dan hasil pemeriksaan head-to-toe yang abnormal atau perlu perhatian.

3. **Diagnosa Keperawatan & Rencana Perawatan**: Sajikan diagnosis keperawatan yang sudah ditegakkan beserta tujuan, kriteria evaluasi, dan intervensi yang direncanakan.

4. **Perkembangan Kondisi Pasien (Berdasarkan Catatan Timbang Terima)**: Analisis kronologis perkembangan pasien dari catatan SOAP. Identifikasi tren (membaik/memburuk), respons terhadap intervensi, dan perubahan signifikan.

5. **Risiko & Hal yang Perlu Diperhatikan**: Identifikasi potensi risiko (jatuh, infeksi, alergi, dll.) dan hal-hal yang memerlukan monitoring ketat.

6. **Rekomendasi**: Berikan saran klinis untuk langkah perawatan selanjutnya berdasarkan analisis data.

Gunakan **heading, subheading, bullet points, dan bold text** untuk memudahkan pembacaan. Jangan tambahkan informasi di luar data yang diberikan. Jika data tidak tersedia untuk suatu bagian, sebutkan bahwa data belum tersedia.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });

    const text = response.text;
    if (!text) {
      return { error: "Gemini tidak mengembalikan hasil. Coba lagi." };
    }

    // 4. Save to DB
    const summary = await prisma.aiSummary.create({
      data: {
        patientId,
        content: text,
        model: GEMINI_MODEL,
      },
    });

    // 5. Audit log
    await logAudit("CREATE", "AiSummary", summary.id, {
      model: GEMINI_MODEL,
      patientId,
      patientName: patient.nama,
      noRm: patient.noRm,
      action: "AI_SUMMARIZE",
    });

    return { success: true, summary };
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return { error: err.message || "Gagal menghubungi Gemini API." };
  }
}
