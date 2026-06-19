import cc from "currency-codes";

export const resolveCurrencyCode = (code: number): string =>
  cc.number(String(code))?.code ?? String(code);

export const formatUnixTimestamp = (ts: number): string =>
  new Date(ts * 1000).toISOString();

const PERMISSION_MAP: Record<string, string> = {
  p: "personal-info",
  s: "statement",
  f: "fop",
  j: "jar",
  m: "monobank",
};

export const decodePermissions = (permissions: string): string[] =>
  permissions.split("").map((c) => PERMISSION_MAP[c] ?? c);
