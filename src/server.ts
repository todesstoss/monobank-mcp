import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import pckg from "../package.json" with { type: "json" };

export const server = new McpServer({
  name: pckg.description,
  version: pckg.version,
});

export const transport = new StdioServerTransport();
