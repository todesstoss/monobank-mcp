import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getStatement } from "../services/statement.ts";

export const initStatementTool = (server: McpServer) => {
  server.tool(
    "monobank-client-statement",
    "Get monobank client statement. One month is maximum. toDate is optional and defaults to current date. Date format is ISO 8601. The 'amount', 'balance' fields in the statement items represents the transaction amount in the smallest currency unit (e.g., cents) and should be divided by 100 to get the actual amount in the base currency unit.",
    {
      accountId: z.union([z.string(), z.literal("default")]),
      fromDate: z.string().datetime(),
      toDate: z.string().datetime().optional(),
    },
    async ({ accountId, fromDate, toDate }) => {
      const account = accountId === "default" ? "0" : accountId;
      const from = convertDatetimeToUnix(fromDate);
      const to = toDate ? convertDatetimeToUnix(toDate) : undefined;

      const statement = await getStatement({ account, from, to });

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(statement, null, 2),
          },
        ],
      };
    }
  );
};

const convertDatetimeToUnix = (date: string) => {
  const parsedDate = new Date(date);
  const ms = parsedDate.getTime();

  if (isNaN(ms)) {
    throw new Error("Invalid date format. Please use ISO 8601 format.");
  }

  return Math.floor(ms / 1000).toString();
};
