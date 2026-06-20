import { api } from "../api/index.ts";
import { invalidate, cachedFetch } from "../cache.ts";
import { resolveCurrencyCode, decodePermissions } from "../utils.ts";

const CLIENT_INFO_CACHE_KEY = "clientInfo";

export const invalidateClientInfoCache = () =>
  invalidate(CLIENT_INFO_CACHE_KEY);

export const getClientInfo = () =>
  cachedFetch(CLIENT_INFO_CACHE_KEY, async () => {
    const { webHookUrl, permissions, accounts, jars, managedClients, ...rest } =
      await api.clientInfo();
    return {
      ...rest,
      webhookUrl: webHookUrl,
      permissions: decodePermissions(permissions),
      accounts: accounts.map(
        ({ currencyCode, balance, creditLimit, ...a }) => ({
          ...a,
          currencyCode: resolveCurrencyCode(currencyCode),
          balance: balance / 100,
          creditLimit: creditLimit / 100,
        })
      ),
      jars: jars?.map(({ currencyCode, balance, goal, ...j }) => ({
        ...j,
        currencyCode: resolveCurrencyCode(currencyCode),
        balance: balance / 100,
        goal: goal / 100,
      })),
      managedClients: managedClients?.map(({ accounts: mc, ...m }) => ({
        ...m,
        accounts: mc.map(({ currencyCode, balance, creditLimit, ...a }) => ({
          ...a,
          currencyCode: resolveCurrencyCode(currencyCode),
          balance: balance / 100,
          creditLimit: creditLimit / 100,
        })),
      })),
    };
  });
