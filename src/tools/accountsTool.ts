import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClientInfo } from "../services/clientInfo.ts";
import { toolHandler } from "./utils.ts";

export const initAccountsTool = (server: McpServer) => {
  server.registerTool(
    "monobank-personal-accounts",
    {
      description:
        "Returns a compact list of all Monobank accounts and jars linked to this token. Use this to discover accountId values before calling monobank-personal-statement.\n\nEach account: id (use as accountId), type (card product), currencyCode, balance, maskedPan.\nEach jar: id, title, currencyCode, balance, goal (0 if no target set).",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    toolHandler(async () => {
      const { accounts, jars } = await getClientInfo();
      return {
        accounts: accounts.map(
          ({ id, type, currencyCode, balance, maskedPan }) => ({
            id,
            type,
            currencyCode,
            balance,
            maskedPan,
          })
        ),
        jars: jars?.map(({ id, title, currencyCode, balance, goal }) => ({
          id,
          title,
          currencyCode,
          balance,
          goal,
        })),
      };
    })
  );
};
