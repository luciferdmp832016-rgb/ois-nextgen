import { z } from "zod";

export const productInstallationRequestSchema = z.object({
  productCode: z.enum(["OIS", "PITS", "CS_AGENT", "KEIHB", "ICR"]),
  projectId: z.string().min(1),
  lifecycle: z.enum(["ACTIVE", "SUSPENDED", "ARCHIVED"]).default("ACTIVE")
});

export type ProductInstallationRequest = z.infer<typeof productInstallationRequestSchema>;
