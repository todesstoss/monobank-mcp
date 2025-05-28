# Monobank MCP Server

A Monobank MCP (Model Context Protocol) Server that provides tools to interact with the Monobank API.

## Available Tools

The server exposes the following tools:

- **Currency Tool**: Retrieves current currency exchange rates from Monobank.
- **Client Info Tool**: Fetches information about the authenticated client.
- **Statement Tool**: Fetches account statements for a specified period.

## Prerequisites

- Personal Monobank API Token ([get it](https://api.monobank.ua/index.html))
- Node.js (23.6.0)
- pnpm

## Getting Started

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd monobank-mcp
    ```

2.  **Install dependencies:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add your Monobank API token:

    ```env
    MONOBANK_API_TOKEN=your_api_token_here
    ```

4.  **Run the server:**
    ```bash
    pnpm start
    ```

## License

This project is licensed under the MIT License.
