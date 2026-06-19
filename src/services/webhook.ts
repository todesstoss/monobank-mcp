import { z } from "zod";
import { personalMonobankApi } from "../api/monobankApi.ts";
import { invalidateClientInfoCache } from "./clientInfo.ts";

const SetWebhookSchema = z.object({
  webHookUrl: z.union([z.string().url(), z.literal("")]),
});

export const setWebhook = async (url: string) => {
  await personalMonobankApi.post(
    "/webhook",
    SetWebhookSchema.parse({ webHookUrl: url })
  );
  invalidateClientInfoCache();
};
