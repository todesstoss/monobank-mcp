import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCurrencies } from "../services/currency.ts";
import { toolHandler } from "./utils.ts";

export const initCurrencyTool = (server: McpServer) => {
  server.registerTool(
    "monobank-bank-currency",
    {
      description:
        "Returns Monobank exchange rates for all supported currencies.\n\nResponse fields:\n- baseCurrency / quoteCurrency: ISO 4217 currency codes (e.g. 'USD', 'EUR', 'UAH'). quoteCurrency is almost always 'UAH' — except the EUR/USD pair.\n- date: ISO 8601 timestamp of the last rate update.\n- rateSell: rate at which the bank sells baseCurrency (you pay in quoteCurrency). Present only for directly traded pairs.\n- rateBuy: rate at which the bank buys baseCurrency (you receive in quoteCurrency). Present only for directly traded pairs.\n- rateCross: mid-market rate for all other currencies. Use when rateSell/rateBuy are absent.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    toolHandler(getCurrencies)
  );
};
