import type { CurrencyCodeRecord } from "currency-codes";
import { personalMonobankApi } from "../api/monobankApi.ts";
import { cache } from "../cache.ts";

export interface Account {
  id: string;
  sendId: string;
  balance: number;
  creditLimit: number;
  type: string;
  currencyCode: CurrencyCodeRecord["number"];
  cashbackType: CurrencyCodeRecord["code"];
  maskedPan: string[];
  iban: string;
}

export interface Jar {
  id: string;
  sendId: string;
  title: string;
  description: string;
  currencyCode: CurrencyCodeRecord["number"];
  balance: number;
  goal: number;
}

export interface ClientInfo {
  clientId: string;
  name: string;
  webHookUrl: string;
  permissions: string;
  accounts: Account[];
  jars?: Jar[];
}

const CLIENT_INFO_CACHE_KEY = "clientInfo";

export const getClientInfo = async () => {
  const cachedData = cache.get<ClientInfo>(CLIENT_INFO_CACHE_KEY);

  if (cachedData) {
    return cachedData;
  }

  const { data } = await personalMonobankApi<ClientInfo>("/client-info");

  cache.set(CLIENT_INFO_CACHE_KEY, data);

  return data;
};
