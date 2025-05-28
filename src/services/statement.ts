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

interface GetStatementUrlPayload {
  account: string;
  from: string;
  to?: string;
}

const STATEMENT_CACHE_BASE_KEY = "statement";

interface GetStatementCacheKeyPayload
  extends Omit<GetStatementUrlPayload, "to"> {
  to: NonNullable<GetStatementUrlPayload["to"]>;
}

const getStatementCacheKey = ({
  account,
  from,
  to,
}: GetStatementCacheKeyPayload) =>
  `${STATEMENT_CACHE_BASE_KEY}-${account}-${from}-${to}`;

const getStatementUrl = ({ account, from, to }: GetStatementUrlPayload) =>
  `/statement/${account}/${from}${to ? `/${to}` : ""}`;

interface GetStatementPayload extends GetStatementUrlPayload {}

export const getStatement = async ({
  account,
  from,
  to,
}: GetStatementPayload) => {
  const cachedData = to
    ? cache.get<Statement[]>(getStatementCacheKey({ account, from, to }))
    : undefined;

  if (cachedData) {
    return cachedData;
  }

  const { data } = await personalMonobankApi<Statement[]>(
    getStatementUrl({ account, from, to })
  );

  if (to) {
    cache.set(getStatementCacheKey({ account, from, to }), data);
  }

  return data;
};
