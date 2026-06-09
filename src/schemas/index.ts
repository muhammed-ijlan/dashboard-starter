import type { TFunction } from "i18next";
import { z } from "zod";

const requiredString = (msg: string) => z.string({ error: msg }).min(1, msg);

// Auth Login
export const getLoginSchemas = (t: TFunction<"auth">) => ({
  account: requiredString(t("auth.accountRequired")),
  password: requiredString(t("auth.passwordRequired")),
});

// Admin Modal
export const adminModalSchemas = (msgs: {
  accountRequired: string;
  nameRequired: string;
  emailRequired: string;
  emailInvalid: string;
  roleRequired: string;
  passwordRequired: string;
  confirmRequired: string;
}) => ({
  account: requiredString(msgs.accountRequired),
  name: requiredString(msgs.nameRequired),
  email: requiredString(msgs.emailRequired).pipe(z.email({ error: msgs.emailInvalid })),
  role: requiredString(msgs.roleRequired),
  password: requiredString(msgs.passwordRequired),
  confirm: requiredString(msgs.confirmRequired),
});

// Role Drawer
export const roleDrawerSchemas = (msgs: { nameRequired: string; descriptionRequired: string }) => ({
  name: requiredString(msgs.nameRequired),
  description: requiredString(msgs.descriptionRequired),
});

// DApp Drawer
export const dappDrawerSchemas = (msgs: {
  nameRequired: string;
  categoryRequired: string;
  urlRequired: string;
  urlInvalid: string;
  iconInvalid: string;
}) => ({
  name: requiredString(msgs.nameRequired),
  typeId: z.number({ error: msgs.categoryRequired }),
  url: requiredString(msgs.urlRequired).pipe(z.url({ error: msgs.urlInvalid })),
  icon: z.union([z.literal(""), z.url({ error: msgs.iconInvalid })]).optional(),
});
