import { server, transport } from "./server.ts";
import { initCurrencyTool } from "./tools/currencyTool.ts";
import { initClientInfoTool } from "./tools/clientInfoTool.ts";
import { initStatementTool } from "./tools/statementTool.ts";

initCurrencyTool(server);
initClientInfoTool(server);
initStatementTool(server);

await server.connect(transport);
