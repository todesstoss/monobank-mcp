import axios, { type AxiosInstance } from "axios";
import { env } from "../env.ts";
import { MONOBANK_API_BASE_URL } from "./constants.ts";
import { logger } from "../logger.ts";

const addLoggingInterceptors = (instance: AxiosInstance) => {
  instance.interceptors.response.use(
    (response) => {
      logger.info(
        `Request to ${response.config.url} successful with status ${response.status}`
      );

      return response;
    },
    (error) => {
      if (axios.isAxiosError(error)) {
        logger.error(
          `Request to ${error.config?.url} failed with error: ${error.message}`
        );
        if (error.response?.status === 429) {
          return Promise.reject(
            new Error(
              "Monobank rate limit reached. Personal endpoints allow 1 request per minute. Wait 60 seconds and try again."
            )
          );
        }
      } else {
        logger.error(`Request failed with error: ${error}`);
      }

      return Promise.reject(error);
    }
  );
};

export const publicMonobankApi = axios.create({
  baseURL: MONOBANK_API_BASE_URL,
});

addLoggingInterceptors(publicMonobankApi);

export const personalMonobankApi = axios.create({
  baseURL: `${MONOBANK_API_BASE_URL}/personal`,
  headers: {
    "X-Token": env.MONOBANK_API_TOKEN,
  },
});

addLoggingInterceptors(personalMonobankApi);
