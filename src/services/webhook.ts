import { z } from "zod";
import { personalMonobankApi } from "../api/monobankApi.ts";

const SetWebhookSchema = z.object({ webHookUrl: z.string().url() });

export const setWebhook = async (url: string) => {
  await personalMonobankApi.post(
    "/webhook",
    SetWebhookSchema.parse({ webHookUrl: url })
  );
};
