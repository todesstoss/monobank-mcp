import { api } from "../api/index.ts";
import { cache } from "../cache.ts";
import { resolveCurrencyCode, formatUnixTimestamp } from "../utils.ts";

interface GetStatementPayload {
  account: string;
  from: string;
  to?: string;
}

const STATEMENT_CACHE_BASE_KEY = "statement";

const resolveAccountId = (accountId: string) =>
  accountId === "default" ? "0" : accountId;

const getStatementCacheKey = (account: string, from: string, to: string) =>
  `${STATEMENT_CACHE_BASE_KEY}-${account}-${from}-${to}`;

export const getStatement = async ({
  account,
  from,
  to,
}: GetStatementPayload) => {
  const resolvedAccount = resolveAccountId(account);
  const cacheKey = to
    ? getStatementCacheKey(resolvedAccount, from, to)
    : undefined;

  const cached = cacheKey ? cache.get(cacheKey) : undefined;
  if (cached) {
    return cached;
  }

  const raw = await api.statement(resolvedAccount, from, to);
  const parsed = raw.map(
    ({
      time,
      currencyCode,
      amount,
      operationAmount,
      commissionRate,
      cashbackAmount,
      balance,
      ...item
    }) => ({
      ...item,
      time: formatUnixTimestamp(time),
      currencyCode: resolveCurrencyCode(currencyCode),
      amount: amount / 100,
      operationAmount: operationAmount / 100,
      commissionRate: commissionRate / 100,
      cashbackAmount: cashbackAmount / 100,
      balance: balance / 100,
    })
  );

  if (cacheKey) {
    cache.set(cacheKey, parsed);
  }
  return parsed;
};
