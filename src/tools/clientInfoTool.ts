import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClientInfo } from "../services/clientInfo.ts";
import { toolHandler } from "./utils.ts";

export const initClientInfoTool = (server: McpServer) => {
  server.registerTool(
    "monobank-personal-client-info",
    {
      description:
        "Returns Monobank client profile: identity, token permissions, and all linked accounts and jars.\n\nTop-level fields:\n- clientId / name: client identity.\n- webhookUrl: currently configured webhook URL (empty string if not set).\n- permissions: array of scopes granted to this token (e.g. ['personal-info', 'statement', 'fop', 'jar', 'monobank']).\n- managedClients: FOP/business accounts linked to this token (present only for business tokens). Each has clientId, tin, name, and accounts.\n\nEach account:\n- id: use this as accountId when calling monobank-personal-statement.\n- type: card product ('black', 'white', 'platinum', 'iron', 'fop', 'yellow', 'eAid').\n- currencyCode: ISO 4217 code (e.g. 'UAH', 'USD').\n- balance / creditLimit: amounts in the base currency unit (already divided).\n- cashbackType: cashback programme ('UAH', 'Miles', or empty).\n- iban / maskedPan / sendId: payment identifiers.\n\nEach jar (savings goal):\n- balance / goal: amounts in the base currency unit (already divided). goal is 0 if no target is set.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    toolHandler(getClientInfo)
  );
};
