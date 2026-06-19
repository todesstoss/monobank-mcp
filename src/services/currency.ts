import type { CurrencyCodeRecord } from "currency-codes";
import { publicMonobankApi } from "../api/monobankApi.ts";
import { cachedFetch } from "../cache.ts";

interface Currency {
  currencyCodeA: CurrencyCodeRecord["number"];
  currencyCodeB: CurrencyCodeRecord["number"];
  date: number;
  rateSell: number;
  rateBuy: number;
  rateCross: number;
}

const CURRENCIES_CACHE_KEY = "currencies";

export const getCurrencies = () =>
  cachedFetch<Currency[]>(CURRENCIES_CACHE_KEY, async () => {
    const { data } = await publicMonobankApi<Currency[]>("/bank/currency");
    return data;
  });
