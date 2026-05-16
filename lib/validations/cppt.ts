import * as z from "zod";

const WAKTU_OPTIONS = ["Pagi", "Siang", "Malam"] as const;

export const cpptSchema = z.object({
  tanggal: z.string().min(1, "Tanggal diperlukan"),
  waktu: z.string().min(1, "Waktu diperlukan"),
  subjektif: z.string().min(1, "Subjektif diperlukan"),
  objektif: z.string().min(1, "Objektif diperlukan"),
  assessment: z.string().min(1, "Assessment diperlukan"),
  planning: z.string().min(1, "Planning diperlukan"),
});

export type CpptInput = z.infer<typeof cpptSchema>;
