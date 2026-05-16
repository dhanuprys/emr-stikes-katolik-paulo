import * as z from "zod";

export const labResultSchema = z.object({
  tanggal: z.string().min(1, "Tanggal diperlukan"),
  // Note: For file uploads, validation usually handles the file paths or URLs after upload,
  // or checks File objects directly on the client. Here we validate the paths.
  files: z.array(z.string()).min(1, "Minimal satu dokumen lab diperlukan"),
});

export type LabResultInput = z.infer<typeof labResultSchema>;
