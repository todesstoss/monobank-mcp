import { server, transport } from "./server.ts";
import { initCurrencyTool } from "./tools/currencyTool.ts";
import { initClientInfoTool } from "./tools/clientInfoTool.ts";
import { initStatementTool } from "./tools/statementTool.ts";
import { initAccountsTool } from "./tools/accountsTool.ts";

initCurrencyTool(server);
initClientInfoTool(server);
initStatementTool(server);
initAccountsTool(server);

await server.connect(transport);
