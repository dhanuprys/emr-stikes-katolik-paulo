import type { FieldDef, SectionDef } from "./assessment-fields";

export const resumeSections: SectionDef[] = [
  { title: "Resume (Ringkasan Perawatan Pasien Pulang)", fields: [
    { key:"resumeTanggal", label:"Tanggal dan waktu", type:"datetime" },
    { key:"resumeAnamesa", label:"Anamnesa", type:"textarea" },
    { key:"resumeRpd", label:"Riwayat Penyakit Dahulu", type:"textarea" },
    { key:"resumeRps", label:"Riwayat Penyakit Sekarang", type:"textarea" },
    { key:"resumeFisik", label:"Pemeriksaan Fisik", type:"textarea" },
    { key:"resumeLab", label:"Laboratorium", type:"textarea" },
    { key:"resumeRadiologi", label:"Radiologi", type:"textarea" },
    { key:"resumeLainLain", label:"Lain-lain", type:"textarea", optional:true },
    { key:"resumeDiagnosaMasuk", label:"Diagnosa Masuk", type:"textarea" },
    { key:"resumeDiagnosaAkhir", label:"Diagnosa Akhir", type:"textarea" },
    { key:"resumeTglMasuk", label:"Tanggal Masuk", type:"datetime" },
    { key:"resumeTglKeluar", label:"Tanggal Keluar/Meninggal", type:"datetime", optional:true },
    { key:"resumeIndikasi", label:"Indikasi MRS", type:"textarea" },
    { key:"resumeMasalah", label:"Masalah yang dihadapi", type:"textarea" },
    { key:"resumeKonsultasi", label:"Konsultasi", type:"textarea" },
    { key:"resumePengobatan", label:"Pengobatan", type:"textarea" },
    { key:"resumeTindakan", label:"Pembedahan/Tindakan", type:"textarea" },
    { key:"resumePerjalanan", label:"Perjalanan Penyakit", type:"textarea" },
    { key:"resumeKeadaanKrs", label:"Keadaan/hasil pengobatan waktu KRS", type:"textarea" },
    { key:"resumePrognosis", label:"Prognosis", type:"textarea" },
    { key:"resumeInstruksi", label:"Instruksi/Tindak Lanjut", type:"textarea" },
    { key:"tanggalKontrol", label:"Tanggal Kontrol", type:"datetime", optional:true },
  ]},
];

// Build default values from resume sections
export function buildResumeDefaults(): Record<string, any> {
  const d: Record<string, any> = {};
  for (const s of resumeSections) for (const f of s.fields) {
    d[f.key] = "";
  }
  return d;
}
