import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCurrencies } from "../services/currency.ts";
import { toolHandler } from "./utils.ts";

export const initCurrencyTool = (server: McpServer) => {
  server.registerTool(
    "monobank-currency",
    {
      description:
        "Returns Monobank exchange rates for all supported currencies against UAH (Ukrainian hryvnia).\n\nResponse fields:\n- currencyCodeA / currencyCodeB: ISO 4217 numeric currency codes. Common codes: 840=USD, 978=EUR, 980=UAH, 826=GBP, 756=CHF, 392=JPY, 124=CAD. currencyCodeB is almost always 980 (UAH) — the one exception is the EUR/USD pair (978/840).\n- date: Unix timestamp of the last rate update for this pair.\n- rateSell: rate at which the bank sells currencyCodeA — the amount in currencyCodeB you pay to buy 1 unit of currencyCodeA. Present only for directly traded pairs (USD/UAH, EUR/UAH, EUR/USD).\n- rateBuy: rate at which the bank buys currencyCodeA — the amount in currencyCodeB you receive when selling 1 unit of currencyCodeA. Present only for directly traded pairs.\n- rateCross: mid-market cross rate for all other currencies. Use this when rateSell/rateBuy are absent.\n\nExample: currencyCodeA=840, currencyCodeB=980, rateSell=45.03, rateBuy=44.70 means: 1 USD costs 45.03 UAH to buy, and the bank pays 44.70 UAH when you sell 1 USD.",
    },
    toolHandler(getCurrencies)
  );
};
