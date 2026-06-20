import { api } from "../api/index.ts";
import { cachedFetch } from "../cache.ts";
import { resolveCurrencyCode, formatUnixTimestamp } from "../utils.ts";

const CURRENCIES_CACHE_KEY = "currencies";

export const getCurrencyRate = async (base: string, quote: string) => {
  const rates = await getCurrencies();
  return (
    rates.find(
      (r) =>
        r.baseCurrency.toUpperCase() === base.toUpperCase() &&
        r.quoteCurrency.toUpperCase() === quote.toUpperCase()
    ) ?? null
  );
};

export const getCurrencies = () =>
  cachedFetch(CURRENCIES_CACHE_KEY, async () => {
    const raw = await api.currencies();
    return raw.map(({ currencyCodeA, currencyCodeB, date, ...rest }) => ({
      baseCurrency: resolveCurrencyCode(currencyCodeA),
      quoteCurrency: resolveCurrencyCode(currencyCodeB),
      date: formatUnixTimestamp(date),
      ...rest,
    }));
  });
