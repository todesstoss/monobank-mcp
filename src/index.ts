import { server, transport } from "./server.ts";
import { initCurrencyTool } from "./tools/currencyTool.ts";
import { initClientInfoTool } from "./tools/clientInfoTool.ts";
import { initStatementTool } from "./tools/statementTool.ts";
import { initAccountsTool } from "./tools/accountsTool.ts";
import {
  initGetWebhookTool,
  initSetWebhookTool,
  initUnsetWebhookTool,
} from "./tools/webhookTool.ts";

const tools = [
  initCurrencyTool,
  initClientInfoTool,
  initStatementTool,
  initAccountsTool,
  initGetWebhookTool,
  initSetWebhookTool,
  initUnsetWebhookTool,
];

tools.forEach((init) => init(server));

await server.connect(transport);
