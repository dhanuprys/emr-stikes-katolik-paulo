import * as z from "zod";

export const cairanMasukSchema = z.object({
  jenis: z.string().min(1, "Jenis cairan masuk diperlukan"),
  keterangan: z.string().optional().nullable(),
  jumlah: z.coerce.number().min(0, "Jumlah tidak boleh negatif"),
});

export const cairanKeluarSchema = z.object({
  jenis: z.string().min(1, "Jenis cairan keluar diperlukan"),
  jenisLain: z.string().optional().nullable(),
  keterangan: z.string().optional().nullable(),
  jumlah: z.coerce.number().min(0, "Jumlah tidak boleh negatif"),
});

export const observationSchema = z.object({
  tanggal: z.string().min(1, "Tanggal dan waktu diperlukan"),
  
  nadi: z.string().min(1, "Nadi diperlukan"),
  tensi: z.string().min(1, "Tensi diperlukan"),
  rr: z.string().min(1, "RR diperlukan"),
  spo2: z.string().min(1, "SPO2 diperlukan"),
  nrs: z.string().min(1, "NRS diperlukan"),
  gcs: z.string().min(1, "GCS diperlukan"),
  pupil: z.string().min(1, "Pupil diperlukan"),
  infus: z.string().min(1, "Infus diperlukan"),
  ews: z.string().min(1, "EWS diperlukan"),
  
  cm: z.array(cairanMasukSchema).default([]),
  ck: z.array(cairanKeluarSchema).default([]),
  
  balans: z.coerce.number(),
  balansStart: z.string().optional().nullable(),
  keistimewaan: z.string().optional().nullable(),
});

export type ObservationInput = z.infer<typeof observationSchema>;
export type CairanMasukInput = z.infer<typeof cairanMasukSchema>;
export type CairanKeluarInput = z.infer<typeof cairanKeluarSchema>;
