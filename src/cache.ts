import NodeCache from "node-cache";
import { logger } from "./logger.ts";

export const cache = new NodeCache({
  stdTTL: 60 * 60,
});

cache.on("set", (key) => {
  logger.info(`Cache saved for key: ${key}`);
});

export const invalidate = (key: string) => cache.del(key);

export const cachedFetch = async <T>(
  key: string,
  fetcher: () => Promise<T>
): Promise<T> => {
  const cached = cache.get<T>(key);
  if (cached) return cached;
  const data = await fetcher();
  cache.set(key, data);
  return data;
};
