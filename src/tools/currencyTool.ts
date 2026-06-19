import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCurrencies } from "../services/currency.ts";
import { toTextContent } from "./utils.ts";

export const initCurrencyTool = (server: McpServer) => {
  server.tool(
    "monobank-currency",
    "Get monobank currencies information, exchange rates, and other related data.",
    async () => toTextContent(await getCurrencies())
  );
};
