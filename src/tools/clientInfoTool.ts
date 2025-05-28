import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getClientInfo } from "../services/clientInfo.ts";

export const initClientInfoTool = (server: McpServer) => {
  server.tool(
    "monobank-client-info",
    "Get monobank client information. This includes client ID, name, accounts, jars, etc. The 'balance', 'goal' fields in the accounts, jars items represents the transaction amount in the smallest currency unit (e.g., cents) and should be divided by 100 to get the actual amount in the base currency unit.",
    async () => {
      const clientInfo = await getClientInfo();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(clientInfo, null, 2),
          },
        ],
      };
    }
  );
};
