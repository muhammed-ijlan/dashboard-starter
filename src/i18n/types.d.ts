import "i18next";
import { resources } from "./resources";

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "common";
    resources: (typeof resources)["en"];
  }
}

type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${"" extends P ? "" : "."}${P}`
    : never
  : never;

export type NestedPaths<T> = {
  [K in keyof T & string]: T[K] extends object ? Join<K, NestedPaths<T[K]>> : K;
}[keyof T & string];

export type UsersTranslationKey = NestedPaths<typeof resources.en.users>;
export type CommonTranslationKey = NestedPaths<typeof resources.en.common>;
export type WalletTranslationKey = NestedPaths<typeof resources.en.wallet>;
export type TransactionsTranslationKey = NestedPaths<
  typeof resources.en.transactions
>;
