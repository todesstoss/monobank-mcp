# Changelog

## 1.0.0

Initial release. MCP server for Monobank exposing exchange rates, account info, transaction history, and webhook management as tools for Claude and other MCP clients.

### Tools

- `monobank-bank-currency` — all Monobank exchange rates (public, no token required)
- `monobank-bank-currency-rate` — single currency pair lookup (public, no token required)
- `monobank-personal-client-info` — full client profile with accounts, jars, and FOP/business accounts
- `monobank-personal-accounts` — compact account list for ID discovery
- `monobank-personal-statement` — transaction history, max 31 days per request
- `monobank-get-webhook` / `monobank-set-webhook` / `monobank-unset-webhook` — webhook management

### Features

- Server-side caching (1-hour TTL) for client info and currency rates — repeated reads never hit the Monobank rate limit
- Amounts in base currency units, timestamps as ISO 8601, currency codes as ISO 4217
- Token-optional startup — public tools always available; personal tools enabled only when `MONOBANK_API_TOKEN` is set
- Clear 429 rate-limit error messages with retry guidance
