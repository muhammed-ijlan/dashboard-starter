import i18n from "@/i18n/i18n";

function t(key: string, fallback: string): string {
  return i18n.t(key, { ns: "common", defaultValue: fallback });
}

export const SPECIAL_CHAR_REGEX = /[^A-Za-z0-9\s]/;

export function validatePasswordStrength(password: string): string | undefined {
  if (password.length < 8)
    return t("password.errors.length", "Password must be at least 8 characters");
  if (!/[A-Z]/.test(password))
    return t("password.errors.uppercase", "Password must contain an uppercase letter");
  if (!/[a-z]/.test(password))
    return t("password.errors.lowercase", "Password must contain a lowercase letter");
  if (/\d/.test(password) === false)
    return t("password.errors.number", "Password must contain a number");
  if (!SPECIAL_CHAR_REGEX.test(password))
    return t("password.errors.special", "Password must contain a special character");
  return undefined;
}
