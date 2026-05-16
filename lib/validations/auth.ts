import * as z from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Username diperlukan"),
  password: z.string().min(1, "Password diperlukan"),
});

export type LoginInput = z.infer<typeof loginSchema>;
