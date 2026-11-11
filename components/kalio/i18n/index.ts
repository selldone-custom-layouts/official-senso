/*
 * Senso's words, per language: the shared Kalio base (base/<lang>.ts, a copy
 * of new-shop-kits/i18n/kalio-base) plus Senso's own (senso.<lang>.ts).
 * English is bundled; every other language is its own small chunk, fetched
 * only when a visitor picks it (lang-<code>.ts merges its two files). The
 * Digini shop's languages: ar, hi, da. A language the owner enables later:
 * copy base/<code>.ts, write senso.<code>.ts, add lang-<code>.ts and one
 * line below.
 */
import baseEn from "./base/en";
import sensoEn from "./senso.en";

export const EN: Record<string, string> = { ...baseEn, ...sensoEn };

export const LOADERS: Record<string, () => Promise<any>> = {
  ar: () => import("./lang-ar"),
  hi: () => import("./lang-hi"),
  da: () => import("./lang-da"),
};
