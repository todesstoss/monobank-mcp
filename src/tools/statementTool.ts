import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getStatement } from "../services/statement.ts";
import { toTextContent } from "./utils.ts";

export const initStatementTool = (server: McpServer) => {
  server.tool(
    "monobank-client-statement",
    "Get monobank client statement. One month is maximum. toDate is optional and defaults to current date. Date format is ISO 8601. The 'amount', 'balance' fields in the statement items represents the transaction amount in the smallest currency unit (e.g., cents) and should be divided by 100 to get the actual amount in the base currency unit.",
    {
      accountId: z.string(),
      fromDate: z.string().datetime({ offset: true }),
      toDate: z.string().datetime({ offset: true }).optional(),
    },
    async ({ accountId, fromDate, toDate }) => {
      const from = isoToUnixString(fromDate);
      const to = toDate ? isoToUnixString(toDate) : undefined;
      return toTextContent(
        await getStatement({ account: accountId, from, to })
      );
    }
  );
};

const isoToUnixString = (date: string) =>
  Math.floor(new Date(date).getTime() / 1000).toString();
