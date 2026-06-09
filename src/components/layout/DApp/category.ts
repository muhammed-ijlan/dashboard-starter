import { LANGUAGES } from "@/constants/const";
import type { DAppTypeLang } from "@/api/dapps";

interface CategoryNames {
  nameEn: string;
  nameZhCn: string;
  nameZhHk?: string;
}

export function getCategoryDisplayName(cat: CategoryNames, language: string): string {
  if (language === LANGUAGES.ZH) {
    return cat.nameZhCn || cat.nameZhHk || cat.nameEn || "";
  }
  return cat.nameEn || cat.nameZhCn || cat.nameZhHk || "";
}

export function matchCategoryByDisplayName(cat: CategoryNames, displayName: string): boolean {
  return (
    cat.nameEn === displayName ||
    cat.nameZhCn === displayName ||
    (cat.nameZhHk ?? "") === displayName
  );
}

export function getDappTypeDisplayName(
  typesLang: DAppTypeLang[] | undefined,
  fallback: string,
  language: string,
): string {
  if (!typesLang?.length) return fallback;
  const textFor = (lang: string) => typesLang.find((entry) => entry.lang === lang)?.text || "";
  const resolved =
    language === LANGUAGES.ZH
      ? textFor("zh_cn") || textFor("zh_hk") || textFor("en")
      : textFor("en") || textFor("zh_cn") || textFor("zh_hk");
  return resolved || fallback;
}
