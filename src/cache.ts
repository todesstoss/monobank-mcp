import NodeCache from "node-cache";
import { logger } from "./logger.ts";

export const cache = new NodeCache({
  stdTTL: 60 * 60,
});

cache.on("set", (key) => {
  logger.info(`Cache saved for key: ${key}`);
});
