import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  MONOBANK_API_TOKEN: z.string(),
});

export const env = envSchema.parse(process.env);
