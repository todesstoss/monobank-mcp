import type { CurrencyCodeRecord } from "currency-codes";
import { publicMonobankApi } from "../api/monobankApi.ts";
import { cache } from "../cache.ts";

interface Currency {
  currencyCodeA: CurrencyCodeRecord["number"];
  currencyCodeB: CurrencyCodeRecord["number"];
  date: number;
  rateSell: number;
  rateBuy: number;
  rateCross: number;
}

const CURRENCIES_CACHE_KEY = "currencies";

export const getCurrencies = async () => {
  const cachedData = cache.get<Currency[]>(CURRENCIES_CACHE_KEY);

  if (cachedData) {
    return cachedData;
  }

  const { data } = await publicMonobankApi<Currency[]>("/bank/currency");

  cache.set(CURRENCIES_CACHE_KEY, data);

  return data;
};
