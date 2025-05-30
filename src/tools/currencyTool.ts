import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCurrencies } from "../services/currency.ts";

export const initCurrencyTool = (server: McpServer) => {
  server.tool(
    "monobank-currency",
    "Get monobank currencies information, exchange rates, and other related data.",
    async () => {
      const currencies = await getCurrencies();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(currencies, null, 2),
          },
        ],
      };
    }
  );
};
