# monobank-mcp

[![npm version](https://img.shields.io/npm/v/@dirgen/monobank-mcp)](https://www.npmjs.com/package/@dirgen/monobank-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D24.17.0-brightgreen)](https://nodejs.org)

MCP server for [Monobank](https://monobank.ua) — exposes your accounts, transactions, exchange rates, and webhook configuration as tools for Claude and other MCP clients.

Responses are pre-processed for LLM consumption: amounts are in base currency units (not cents), timestamps are ISO 8601, currency codes are ISO 4217 strings, and permissions are decoded to human-readable names. Frequently-accessed data is cached server-side for 1 hour so repeated reads never hit the Monobank rate limit.

## Quick Start — Claude Desktop

Add to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "monobank": {
      "command": "npx",
      "args": ["-y", "@dirgen/monobank-mcp"],
      "env": {
        "MONOBANK_API_TOKEN": "your_token_here"
      }
    }
  }
}
```

## Quick Start — Claude Code

```bash
claude mcp add monobank -- npx -y @dirgen/monobank-mcp
```

Then add your token to `.claude/settings.json`:

```json
{
  "mcpServers": {
    "monobank": {
      "env": { "MONOBANK_API_TOKEN": "your_token_here" }
    }
  }
}
```

## Getting a Token

Open [api.monobank.ua](https://api.monobank.ua/index.html) and scan the QR code with the Monobank app to generate your personal API token. The token never leaves your machine — it is passed directly to the server process as an environment variable.

## Available Tools

### Public — no token required

| Tool                          | Description                                                                                                                                                                  |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `monobank-bank-currency`      | All Monobank exchange rates. Returns `baseCurrency` / `quoteCurrency` (ISO 4217), `date` (ISO 8601), and `rateSell` / `rateBuy` (traded pairs) or `rateCross` (cross rates). |
| `monobank-bank-currency-rate` | Exchange rate for a single currency pair. Inputs: `baseCurrency`, `quoteCurrency` (defaults to `UAH`). Faster than fetching the full list.                                   |

### Personal — requires `MONOBANK_API_TOKEN`

| Tool                            | Description                                                                                                                                                                                      |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `monobank-personal-client-info` | Full client profile: identity, decoded token permissions, all accounts and jars including FOP/business accounts (`managedClients`). Account `id` fields are what you pass to the statement tool. |
| `monobank-personal-accounts`    | Compact account and jar list (id, type, currencyCode, balance, maskedPan). Use this for quick account discovery before fetching statements.                                                      |
| `monobank-personal-statement`   | Transaction history for an account. Inputs: `accountId` (from client-info, or `"0"` for default UAH account), `fromDate`, `toDate` (ISO 8601 with timezone). Maximum range: 31 days per request. |
| `monobank-get-webhook`          | Returns the webhook URL currently configured for this token. Empty string means no webhook is set.                                                                                               |
| `monobank-set-webhook`          | ⚠️ **Destructive.** Sets the webhook URL. Overwrites the existing URL immediately with no confirmation — check the current value with `monobank-get-webhook` first.                              |
| `monobank-unset-webhook`        | ⚠️ **Destructive.** Removes the webhook by setting the URL to empty string.                                                                                                                      |

## Caching

The server caches responses to stay within Monobank's rate limits and avoid redundant API calls:

| Data                                  | Cache TTL                                       |
| ------------------------------------- | ----------------------------------------------- |
| Client info (`/personal/client-info`) | 1 hour                                          |
| Currency rates (`/bank/currency`)     | 1 hour                                          |
| Statement with a fixed `toDate`       | 1 hour                                          |
| Statement without `toDate`            | Not cached (open-ended range → stale data risk) |

Webhook mutations automatically invalidate the client-info cache so the next read reflects the updated URL.

## Rate Limits

Monobank personal endpoints allow **1 request per 60 seconds**. If the limit is hit, the server returns a clear error message telling you to wait 60 seconds. The 1-hour cache means most repeated reads are served locally without hitting the API at all.

## Developer Setup

Requires Node.js ≥ 24.17.0 and pnpm.

```bash
git clone https://github.com/todesstoss/monobank-mcp
cd monobank-mcp
pnpm install
```

Create a `.env` file:

```env
MONOBANK_API_TOKEN=your_token_here
```

```bash
pnpm start       # run the MCP server
pnpm inspect     # open MCP Inspector in the browser for interactive testing
pnpm typecheck   # type-check without emitting
pnpm lint        # lint src/
```

## Troubleshooting

**Invalid token / 401** — regenerate your token at [api.monobank.ua](https://api.monobank.ua/index.html). Tokens expire if unused.

**Rate limit / 429** — wait 60 seconds. The server will tell you when this happens. Repeated reads within an hour are served from cache and won't trigger this.

**Statement range > 31 days** — split the request into multiple calls, each covering ≤ 31 days. The tool will tell you if the range is too wide.

**Currency pair not found** — use `monobank-bank-currency` to see all available pairs. Only UAH pairs and EUR/USD are available.

**No `managedClients` in client-info** — this field only appears if you are registered as a FOP (sole proprietor) with Monobank. All tokens are the same personal token — `managedClients` is simply absent if you have no FOP accounts.

## License

MIT
