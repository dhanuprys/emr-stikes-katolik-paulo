import * as z from "zod";

// The initial assessment is extremely dynamic. We'll store it as a JSON blob.
// But we still want a schema for typing.
export const initialAssessmentSchema = z.object({
  // Resume
  tanggalDanWaktu: z.string().min(1, "Tanggal dan waktu diperlukan"),
  anamesa: z.string().min(1, "Anamesa diperlukan"),
  riwayatPenyakitDahulu: z.string().min(1, "Riwayat Penyakit Dahulu diperlukan"),
  riwayatPenyakitSekarang: z.string().min(1, "Riwayat Penyakit Sekarang diperlukan"),
  
  // Pemeriksaan MRS
  fisik: z.string().min(1, "Fisik diperlukan"),
  laboratorium: z.string().min(1, "Laboratorium diperlukan"),
  radiologi: z.string().min(1, "Radiologi diperlukan"),
  lainLainMrs: z.string().optional().nullable(),
  
  diagnosaMasukMrs: z.string().min(1, "Diagnosa Masuk diperlukan"),
  diagnosaAkhir: z.string().min(1, "Diagnosa Akhir diperlukan"),
  tanggalMasukMrs: z.string().min(1, "Tanggal Masuk diperlukan"),
  tanggalKeluarMeninggal: z.string().optional().nullable(),
  indikasiMrs: z.string().min(1, "Indikasi MRS diperlukan"),
  masalahYangDihadapi: z.string().min(1, "Masalah yang dihadapi diperlukan"),
  konsultasi: z.string().min(1, "Konsultasi diperlukan"),
  pengobatan: z.string().min(1, "Pengobatan diperlukan"),
  pembedahanTindakan: z.string().min(1, "Pembedahan/Tindakan diperlukan"),
  perjalananPenyakit: z.string().min(1, "Perjalanan Penyakit diperlukan"),
  keadaanHasilPengobatan: z.string().min(1, "Keadaan/hasil pengobatan waktu KRS diperlukan"),
  prognosis: z.string().min(1, "Prognosis diperlukan"),
  instruksiTindakLanjut: z.string().min(1, "Instruksi/Tindak Lanjut diperlukan"),

  // Asesmen Awal Medis
  keluhanUtamaMedis: z.string().min(1, "Keluhan Utama diperlukan"),
  keluhanPenyerta: z.string().min(1, "Keluhan Penyerta diperlukan"),
  riwayatPenyakitDahuluMedis: z.string().min(1, "Riwayat Penyakit Dahulu diperlukan"),
  riwayatPenyakitKeluarga: z.string().min(1, "Riwayat Penyakit Keluarga diperlukan"),
  
  // Alergi
  alergiMakananMinuman: z.string().min(1, "Alergi Makanan/minuman diperlukan"),
  alergiObat: z.string().min(1, "Alergi Obat diperlukan"),
  alergiLainLain: z.string().min(1, "Alergi Lain-lain diperlukan"),

  // Fisik Medis
  statusGeneralis: z.string().min(1, "Status Generalis diperlukan"),
  statusLokalis: z.string().min(1, "Status Lokalis diperlukan"),
  pemeriksaanPenunjang: z.string().min(1, "Pemeriksaan Penunjang diperlukan"),
  diagnosaKerja: z.string().min(1, "Diagnosa Kerja diperlukan"),
  diagnosaBanding: z.string().min(1, "Diagnosa Banding diperlukan"),
  rencanaPelayanan: z.string().min(1, "Rencana Pelayanan diperlukan"),
  namaDpjpUtama: z.string().min(1, "Nama DPJP Utama diperlukan"),
  tanggalWaktuPengkajian: z.string().min(1, "Tanggal dan waktu pengkajian diperlukan"),

  // We are not validating all the hundreds of optional fields from FORM_FIELDS.md strictly here.
  // Instead we allow any additional keys using a catch-all or just partial mapping for the dynamic sections.
}).passthrough(); // allows other fields since the form is very large and dynamic

export type InitialAssessmentInput = z.infer<typeof initialAssessmentSchema>;
