import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getStatement } from "../services/statement.ts";
import { toTextContent } from "./utils.ts";

const MAX_RANGE_SECONDS = 31 * 24 * 60 * 60;

const inputSchema = z
  .object({
    accountId: z.string(),
    fromDate: z.string().datetime({ offset: true }),
    toDate: z.string().datetime({ offset: true }).optional(),
  })
  .refine(({ fromDate, toDate }) => {
    const from = new Date(fromDate).getTime() / 1000;
    const to = toDate ? new Date(toDate).getTime() / 1000 : Date.now() / 1000;
    return to - from <= MAX_RANGE_SECONDS;
  }, "Date range exceeds 31 days. Monobank limits statement requests to 31 days per call. Split the range into multiple requests.");

export const initStatementTool = (server: McpServer) => {
  server.registerTool(
    "monobank-personal-statement",
    {
      description:
        "Returns a list of transactions for a Monobank account. Maximum range is 31 days per request.\n\nInputs:\n- accountId: account id from monobank-personal-client-info. Use '0' for the default UAH account.\n- fromDate: start of range, ISO 8601 with timezone (e.g. '2026-06-01T00:00:00+03:00').\n- toDate: end of range, ISO 8601 with timezone. Defaults to now if omitted.\n\nEach transaction:\n- amount: transaction amount in base currency unit. Negative = debit (money out), positive = credit (money in).\n- operationAmount: original amount in the operation currency (differs from amount when currencyCode != account currency).\n- currencyCode: ISO 4217 code of the operation currency.\n- balance: account balance after this transaction.\n- commissionRate / cashbackAmount: fee charged and cashback earned, in base currency unit.\n- mcc / originalMcc: Merchant Category Code (ISO 18245).\n- hold: true if the transaction is pending (not yet settled).\n- description: merchant or transfer name.\n- receiptId / invoiceId: identifiers for receipt lookup.\n- counterName / counterIban / counterEdrpou: counterparty info for transfers (present when available).",
      inputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ accountId, fromDate, toDate }) => {
      try {
        const from = isoToUnixString(fromDate);
        const to = toDate ? isoToUnixString(toDate) : undefined;
        return toTextContent(
          await getStatement({ account: accountId, from, to })
        );
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return {
          content: [{ type: "text" as const, text: message }],
          isError: true as const,
        };
      }
    }
  );
};

const isoToUnixString = (date: string) =>
  Math.floor(new Date(date).getTime() / 1000).toString();
