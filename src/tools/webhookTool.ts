import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { setWebhook } from "../services/webhook.ts";
import { toTextContent } from "./utils.ts";

export const initWebhookTool = (server: McpServer) => {
  server.registerTool(
    "monobank-set-webhook",
    {
      description:
        "Sets the webhook URL for this Monobank token. Monobank will send real-time push notifications to this URL for every new transaction.\n\nWARNING: Each token supports only one webhook URL. Calling this tool overwrites the existing webhook URL with no confirmation. Check the current webhookUrl in monobank-personal-client-info before proceeding.\n\nTo remove the webhook, set url to an empty string.",
      inputSchema: z.object({
        url: z
          .string()
          .describe(
            "HTTPS URL to receive webhook events, or empty string to remove the webhook."
          ),
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
