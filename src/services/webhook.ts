import { api } from "../api/index.ts";
import { invalidateClientInfoCache } from "./clientInfo.ts";

export const setWebhook = async (url: string) => {
  await api.setWebhook(url);
  invalidateClientInfoCache();
};
