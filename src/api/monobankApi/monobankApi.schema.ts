import { z } from "zod";

export const CurrencySchema = z.object({
  currencyCodeA: z.number(),
  currencyCodeB: z.number(),
  date: z.number(),
  rateSell: z.number().optional(),
  rateBuy: z.number().optional(),
  rateCross: z.number().optional(),
});

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

const ManagedAccountSchema = z.object({
  id: z.string(),
  balance: z.number(),
  creditLimit: z.number(),
  type: z.string(),
  currencyCode: z.number(),
  iban: z.string(),
});

export const ManagedClientSchema = z.object({
  clientId: z.string(),
  tin: z.number(),
  name: z.string(),
  accounts: z.array(ManagedAccountSchema),
});

export const ClientInfoSchema = z.object({
  clientId: z.string(),
  name: z.string(),
  webHookUrl: z.string(),
  permissions: z.string(),
  accounts: z.array(AccountSchema),
  jars: z.array(JarSchema).optional(),
  managedClients: z.array(ManagedClientSchema).optional(),
});

export const StatementSchema = z.object({
  id: z.string(),
  time: z.number(),
  description: z.string(),
  mcc: z.number(),
  originalMcc: z.number(),
  hold: z.boolean(),
  amount: z.number(),
  operationAmount: z.number(),
  currencyCode: z.number(),
  commissionRate: z.number(),
  cashbackAmount: z.number(),
  balance: z.number(),
  comment: z.string().optional(),
  receiptId: z.string().optional(),
  invoiceId: z.string().optional(),
  counterEdrpou: z.string().optional(),
  counterIban: z.string().optional(),
  counterName: z.string().optional(),
});

export const SetWebhookSchema = z.object({
  webHookUrl: z.union([z.string().url(), z.literal("")]),
});

export type Currency = z.infer<typeof CurrencySchema>;
export type Account = z.infer<typeof AccountSchema>;
export type Jar = z.infer<typeof JarSchema>;
export type ManagedClient = z.infer<typeof ManagedClientSchema>;
export type ClientInfo = z.infer<typeof ClientInfoSchema>;
export type StatementItem = z.infer<typeof StatementSchema>;
