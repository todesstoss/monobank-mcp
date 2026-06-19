import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCurrencies } from "../services/currency.ts";
import { toolHandler } from "./utils.ts";

export const initCurrencyTool = (server: McpServer) => {
  server.registerTool(
    "monobank-currency",
    {
      description:
        "Returns Monobank exchange rates for all supported currencies.\n\nResponse fields:\n- currencyCodeA / currencyCodeB: ISO 4217 currency codes (e.g. 'USD', 'EUR', 'UAH'). currencyCodeB is almost always 'UAH' — except the EUR/USD pair.\n- date: ISO 8601 timestamp of the last rate update.\n- rateSell: bank sells currencyCodeA at this price in currencyCodeB. Present only for directly traded pairs (USD/UAH, EUR/UAH, EUR/USD).\n- rateBuy: bank buys currencyCodeA at this price in currencyCodeB. Present only for directly traded pairs.\n- rateCross: mid-market rate for all other currencies. Use when rateSell/rateBuy are absent.",
    },
    toolHandler(getCurrencies)
  );
};
