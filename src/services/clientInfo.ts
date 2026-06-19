import { z } from "zod";
import { personalMonobankApi } from "../api/monobankApi.ts";
import { invalidate, cachedFetch } from "../cache.ts";
import { resolveCurrencyCode, decodePermissions } from "../utils.ts";

export const AccountSchema = z.object({
  id: z.string(),
  sendId: z.string(),
  balance: z.number(),
  creditLimit: z.number(),
  type: z.string(),
  currencyCode: z.number(),
  cashbackType: z.string(),
  maskedPan: z.array(z.string()),
  iban: z.string(),
});

export const JarSchema = z.object({
  id: z.string(),
  sendId: z.string(),
  title: z.string(),
  description: z.string(),
  currencyCode: z.number(),
  balance: z.number(),
  goal: z.number(),
});

export const ClientInfoSchema = z.object({
  clientId: z.string(),
  name: z.string(),
  webHookUrl: z.string(),
  permissions: z.string(),
  accounts: z.array(AccountSchema),
  jars: z.array(JarSchema).optional(),
});

export type Account = z.infer<typeof AccountSchema>;
export type Jar = z.infer<typeof JarSchema>;
export type ClientInfo = z.infer<typeof ClientInfoSchema>;

const CLIENT_INFO_CACHE_KEY = "clientInfo";

export const invalidateClientInfoCache = () =>
  invalidate(CLIENT_INFO_CACHE_KEY);

export const getClientInfo = () =>
  cachedFetch(CLIENT_INFO_CACHE_KEY, async () => {
    const { data } = await personalMonobankApi<unknown>("/client-info");
    const { webHookUrl, permissions, accounts, jars, ...rest } =
      ClientInfoSchema.parse(data);
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
    };
  });
