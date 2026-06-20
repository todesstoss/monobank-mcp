import { MonobankApi } from "./monobankApi/index.ts";
import { env } from "../env.ts";
import { logger } from "../logger.ts";

export const api = new MonobankApi(env.MONOBANK_API_TOKEN, {
  onFetch: (url) => logger.info(`Fetching ${url}`),
  onSuccess: (url, status) => logger.info(`${url} → ${status}`),
  onError: (url, error) => logger.error(`${url} failed: ${error}`),
});
