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
  
  nadi: z.string().optional().default(""),
  tensi: z.string().optional().default(""),
  rr: z.string().optional().default(""),
  suhu: z.string().optional().default(""),
  spo2: z.string().optional().default(""),
  nrs: z.string().optional().default(""),
  gcs: z.string().optional().default(""),
  pupil: z.string().optional().default(""),
  ews: z.string().optional().default(""),
  
  cm: z.array(cairanMasukSchema).default([]),
  ck: z.array(cairanKeluarSchema).default([]),
  
  balans: z.coerce.number(),
  balansStart: z.string().optional().nullable(),
  keistimewaan: z.string().optional().nullable(),
});

export type ObservationInput = z.infer<typeof observationSchema>;
export type CairanMasukInput = z.infer<typeof cairanMasukSchema>;
export type CairanKeluarInput = z.infer<typeof cairanKeluarSchema>;
