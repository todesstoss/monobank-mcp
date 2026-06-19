import { server, transport } from "./server.ts";
import { initCurrencyTool } from "./tools/currencyTool.ts";
import { initClientInfoTool } from "./tools/clientInfoTool.ts";
import { initStatementTool } from "./tools/statementTool.ts";
import { initAccountsTool } from "./tools/accountsTool.ts";
import { initWebhookTool } from "./tools/webhookTool.ts";

initCurrencyTool(server);
initClientInfoTool(server);
initStatementTool(server);
initAccountsTool(server);
initWebhookTool(server);

await server.connect(transport);
