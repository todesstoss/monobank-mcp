import type { CurrencyCodeRecord } from "currency-codes";
import { personalMonobankApi } from "../api/monobankApi.ts";
import { cache } from "../cache.ts";

interface Statement {
  id: string;
  time: number;
  description: string;
  mcc: number;
  originalMcc: number;
  hold: boolean;
  amount: number;
  operationAmount: number;
  currencyCode: CurrencyCodeRecord["number"];
  commissionRate: number;
  cashbackAmount: number;
  balance: number;
  comment: string;
  receiptId: string;
  invoiceId: string;
  counterEdrpou: string;
  counterIban: string;
  counterName: string;
}

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

const getStatementUrl = (account: string, from: string, to?: string) =>
  `/statement/${account}/${from}${to ? `/${to}` : ""}`;

export const getStatement = async ({
  account,
  from,
  to,
}: GetStatementPayload) => {
  const resolvedAccount = resolveAccountId(account);
  const cacheKey = to
    ? getStatementCacheKey(resolvedAccount, from, to)
    : undefined;

  const cached = cacheKey ? cache.get<Statement[]>(cacheKey) : undefined;
  if (cached) return cached;

  const { data } = await personalMonobankApi<Statement[]>(
    getStatementUrl(resolvedAccount, from, to)
  );

  if (cacheKey) cache.set(cacheKey, data);
  return data;
};
