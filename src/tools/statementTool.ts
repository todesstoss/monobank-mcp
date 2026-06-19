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
        "Get monobank client statement. One month is maximum. toDate is optional and defaults to current date. Date format is ISO 8601. The 'amount', 'balance' fields in the statement items represents the transaction amount in the smallest currency unit (e.g., cents) and should be divided by 100 to get the actual amount in the base currency unit.",
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
