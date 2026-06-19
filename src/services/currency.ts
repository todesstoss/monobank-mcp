import { z } from "zod";
import { publicMonobankApi } from "../api/monobankApi.ts";
import { cachedFetch } from "../cache.ts";
import { resolveCurrencyCode, formatUnixTimestamp } from "../utils.ts";

const CurrencySchema = z.object({
  currencyCodeA: z.number(),
  currencyCodeB: z.number(),
  date: z.number(),
  rateSell: z.number().optional(),
  rateBuy: z.number().optional(),
  rateCross: z.number().optional(),
});

const CURRENCIES_CACHE_KEY = "currencies";

export const getCurrencies = () =>
  cachedFetch(CURRENCIES_CACHE_KEY, async () => {
    const { data } = await publicMonobankApi<unknown>("/bank/currency");
    return z
      .array(CurrencySchema)
      .parse(data)
      .map(({ currencyCodeA, currencyCodeB, date, ...rest }) => ({
        baseCurrency: resolveCurrencyCode(currencyCodeA),
        quoteCurrency: resolveCurrencyCode(currencyCodeB),
        date: formatUnixTimestamp(date),
        ...rest,
      }));
  });
