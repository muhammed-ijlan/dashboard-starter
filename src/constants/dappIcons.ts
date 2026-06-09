const EMOJI_RE = /\p{Extended_Pictographic}|\p{Emoji_Presentation}|\p{Emoji_Modifier_Base}/u;
const URL_RE = /^https?:\/\/.+/i;

export type DappDisplayIcon = { kind: "image"; src: string } | { kind: "text"; value: string };

export const resolveDappDisplayIcon = (
  iconField: string | undefined,
  name: string | undefined,
): DappDisplayIcon => {
  const trimmed = iconField?.trim();
  if (trimmed) {
    if (URL_RE.test(trimmed)) return { kind: "image", src: trimmed };
    if (EMOJI_RE.test(trimmed)) return { kind: "text", value: trimmed };
  }
  return { kind: "text", value: name?.trim().charAt(0).toUpperCase() || "?" };
};

export interface DappCategoryStyle {
  background: string;
  color: string;
}
