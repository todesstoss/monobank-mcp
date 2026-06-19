import { z } from "zod";
import { personalMonobankApi } from "../api/monobankApi.ts";
import { cache } from "../cache.ts";
import { resolveCurrencyCode, formatUnixTimestamp } from "../utils.ts";

const StatementSchema = z.object({
  id: z.string(),
  time: z.number(),
  description: z.string(),
  mcc: z.number(),
  originalMcc: z.number(),
  hold: z.boolean(),
  amount: z.number(),
  operationAmount: z.number(),
  currencyCode: z.number(),
  commissionRate: z.number(),
  cashbackAmount: z.number(),
  balance: z.number(),
  comment: z.string().optional(),
  receiptId: z.string().optional(),
  invoiceId: z.string().optional(),
  counterEdrpou: z.string().optional(),
  counterIban: z.string().optional(),
  counterName: z.string().optional(),
});

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

  const cached = cacheKey
    ? cache.get<z.infer<typeof StatementSchema>[]>(cacheKey)
    : undefined;
  if (cached) return cached;

  const { data } = await personalMonobankApi<unknown>(
    getStatementUrl(resolvedAccount, from, to)
  );

  const parsed = z
    .array(StatementSchema)
    .parse(data)
    .map((item) => ({
      ...item,
      time: formatUnixTimestamp(item.time),
      currencyCode: resolveCurrencyCode(item.currencyCode),
    }));
  if (cacheKey) cache.set(cacheKey, parsed);
  return parsed;
};
