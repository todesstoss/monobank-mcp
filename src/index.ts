import { server, transport } from "./server.ts";
import { env } from "./env.ts";
import { logger } from "./logger.ts";
import { initCurrencyTool } from "./tools/currencyTool.ts";
import { initCurrencyRateTool } from "./tools/currencyRateTool.ts";
import { initClientInfoTool } from "./tools/clientInfoTool.ts";
import { initStatementTool } from "./tools/statementTool.ts";
import { initAccountsTool } from "./tools/accountsTool.ts";
import {
  initGetWebhookTool,
  initSetWebhookTool,
  initUnsetWebhookTool,
} from "./tools/webhookTool.ts";

const publicTools = [initCurrencyTool, initCurrencyRateTool];

const personalTools = [
  initClientInfoTool,
  initStatementTool,
  initAccountsTool,
  initGetWebhookTool,
  initSetWebhookTool,
  initUnsetWebhookTool,
];

publicTools.forEach((init) => init(server));

if (env.MONOBANK_API_TOKEN) {
  personalTools.forEach((init) => init(server));
} else {
  logger.warn(
    "MONOBANK_API_TOKEN is not set — personal tools are disabled (client info, statements, webhooks)"
  );
}

await server.connect(transport);
