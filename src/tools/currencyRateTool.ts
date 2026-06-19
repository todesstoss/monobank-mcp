import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getCurrencyRate } from "../services/currency.ts";
import { toTextContent } from "./utils.ts";

export const initCurrencyRateTool = (server: McpServer) => {
  server.registerTool(
    "monobank-bank-currency-rate",
    {
      description:
        "Returns the Monobank exchange rate for a specific currency pair. Faster than monobank-bank-currency when you need just one rate.\n\nquoteCurrency defaults to 'UAH'. The only non-UAH pair available is EUR/USD.",
      inputSchema: z.object({
        baseCurrency: z
          .string()
          .describe("ISO 4217 currency code to look up (e.g. 'USD', 'EUR')."),
        quoteCurrency: z
          .string()
          .default("UAH")
          .describe("ISO 4217 quote currency code. Defaults to 'UAH'."),
      }),
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async ({ baseCurrency, quoteCurrency }) => {
      try {
        const rate = await getCurrencyRate(baseCurrency, quoteCurrency);
        if (!rate) {
          return {
            content: [
              {
                type: "text" as const,
                text: `No rate found for ${baseCurrency}/${quoteCurrency}. Use monobank-bank-currency to see all available pairs.`,
              },
            ],
            isError: true as const,
          };
        }
        return toTextContent(rate);
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
