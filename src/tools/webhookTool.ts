import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { setWebhook } from "../services/webhook.ts";
import { getClientInfo } from "../services/clientInfo.ts";
import { toTextContent, toolHandler } from "./utils.ts";

export const initGetWebhookTool = (server: McpServer) => {
  server.registerTool(
    "monobank-get-webhook",
    {
      description:
        "Returns the webhook URL currently configured for this Monobank token. Empty string means no webhook is set.",
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    toolHandler(async () => {
      const { webhookUrl } = await getClientInfo();
      return { webhookUrl };
    })
  );
};

export const initSetWebhookTool = (server: McpServer) => {
  server.registerTool(
    "monobank-set-webhook",
    {
      description:
        "Sets the webhook URL for this Monobank token. Monobank will send real-time push notifications to this URL for every new transaction.\n\nWARNING: Each token supports only one webhook URL. Calling this tool overwrites the existing URL with no confirmation. Use monobank-get-webhook to check the current value first.",
      inputSchema: z.object({
        url: z.string().describe("HTTPS URL to receive webhook events."),
      }),
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: false,
        openWorldHint: true,
      },
    },
    async ({ url }) => {
      try {
        await setWebhook(url);
        return toTextContent({ success: true, webhookUrl: url });
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

export const initUnsetWebhookTool = (server: McpServer) => {
  server.registerTool(
    "monobank-unset-webhook",
    {
      description:
        "Removes the webhook URL for this Monobank token. Monobank will stop sending push notifications. Safe to call even if no webhook is currently set.",
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async () => {
      try {
        await setWebhook("");
        return toTextContent({ success: true, webhookUrl: "" });
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
