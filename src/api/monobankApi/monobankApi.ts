import { z } from "zod";
import {
  CurrencySchema,
  ClientInfoSchema,
  StatementSchema,
  SetWebhookSchema,
  type Currency,
  type ClientInfo,
  type StatementItem,
} from "./monobankApi.schema.ts";

const BASE_URL = "https://api.monobank.ua";

interface MonobankApiOptions {
  onFetch?: (url: string) => void;
  onSuccess?: (url: string, status: number) => void;
  onError?: (url: string, error: unknown) => void;
}

export class MonobankApi {
  private token: string | undefined;
  private options: MonobankApiOptions;

  constructor(token?: string, options: MonobankApiOptions = {}) {
    this.token = token;
    this.options = options;
  }

  private async request(url: string, init?: RequestInit): Promise<unknown> {
    this.options.onFetch?.(url);
    let response: Response;
    try {
      response = await fetch(url, init);
    } catch (e) {
      this.options.onError?.(url, e);
      throw e;
    }

    if (!response.ok) {
      const error = new Error(
        response.status === 429
          ? "Monobank rate limit reached. Personal endpoints allow 1 request per minute. Wait 60 seconds and try again."
          : `HTTP ${response.status}`
      );
      this.options.onError?.(url, error);
      throw error;
    }

    this.options.onSuccess?.(url, response.status);
    const text = await response.text();
    if (!text) {
      return undefined;
    }
    try {
      return JSON.parse(text) as unknown;
    } catch (e) {
      this.options.onError?.(url, e);
      throw e;
    }
  }

  private publicGet(path: string) {
    return this.request(`${BASE_URL}${path}`);
  }

  private personalRequest(path: string, init?: RequestInit) {
    if (!this.token) {
      throw new Error("MonobankApi: token is required for personal endpoints");
    }
    return this.request(`${BASE_URL}/personal${path}`, {
      ...init,
      headers: { "X-Token": this.token, ...init?.headers },
    });
  }

  async currencies(): Promise<Currency[]> {
    const data = await this.publicGet("/bank/currency");
    return z.array(CurrencySchema).parse(data);
  }

  async clientInfo(): Promise<ClientInfo> {
    const data = await this.personalRequest("/client-info");
    return ClientInfoSchema.parse(data);
  }

  async statement(
    account: string,
    from: string,
    to?: string
  ): Promise<StatementItem[]> {
    const path = `/statement/${account}/${from}${to ? `/${to}` : ""}`;
    const data = await this.personalRequest(path);
    return z.array(StatementSchema).parse(data);
  }

  async setWebhook(url: string): Promise<void> {
    const body = SetWebhookSchema.parse({ webHookUrl: url });
    await this.personalRequest("/webhook", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
}
