import cc from "currency-codes";

export const resolveCurrencyCode = (code: number): string =>
  cc.number(String(code))?.code ?? String(code);

export const formatUnixTimestamp = (ts: number): string =>
  new Date(ts * 1000).toISOString();
