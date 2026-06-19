import { z } from "zod";
import { personalMonobankApi } from "../api/monobankApi.ts";
import { cachedFetch } from "../cache.ts";
import { resolveCurrencyCode } from "../utils.ts";

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

export const getClientInfo = () =>
  cachedFetch(CLIENT_INFO_CACHE_KEY, async () => {
    const { data } = await personalMonobankApi<unknown>("/client-info");
    const raw = ClientInfoSchema.parse(data);
    return {
      ...raw,
      accounts: raw.accounts.map((a) => ({
        ...a,
        currencyCode: resolveCurrencyCode(a.currencyCode),
      })),
      jars: raw.jars?.map((j) => ({
        ...j,
        currencyCode: resolveCurrencyCode(j.currencyCode),
      })),
    };
  });
