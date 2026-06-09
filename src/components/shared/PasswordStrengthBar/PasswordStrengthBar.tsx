import { useMemo } from "react";
import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { SPECIAL_CHAR_REGEX } from "./validatePasswordStrength";

const RULES = [
  { key: "length", test: (p: string) => p.length >= 8, labelKey: "password.rules.length" },
  { key: "uppercase", test: (p: string) => /[A-Z]/.test(p), labelKey: "password.rules.uppercase" },
  { key: "lowercase", test: (p: string) => /[a-z]/.test(p), labelKey: "password.rules.lowercase" },
  { key: "number", test: (p: string) => /\d/.test(p), labelKey: "password.rules.number" },
  {
    key: "special",
    test: (p: string) => SPECIAL_CHAR_REGEX.test(p),
    labelKey: "password.rules.special",
  },
];

const STRENGTH_KEYS = [
  { labelKey: "password.strength.weak", color: "bg-red-500", text: "text-red-500" },
  { labelKey: "password.strength.weak", color: "bg-red-500", text: "text-red-500" },
  { labelKey: "password.strength.fair", color: "bg-orange-400", text: "text-orange-400" },
  { labelKey: "password.strength.good", color: "bg-yellow-400", text: "text-yellow-500" },
  { labelKey: "password.strength.strong", color: "bg-green-400", text: "text-green-500" },
  { labelKey: "password.strength.veryStrong", color: "bg-green-600", text: "text-green-600" },
];

interface PasswordStrengthBarProps {
  password: string;
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const { t } = useTranslation(Namespace.Common);

  const { passed, score } = useMemo(() => {
    const results = RULES.map((rule) => ({
      ...rule,
      passed: password.length > 0 && rule.test(password),
    }));
    return {
      passed: results,
      score: results.filter((r) => r.passed).length,
    };
  }, [password]);

  if (!password) return null;

  const config = STRENGTH_KEYS[score]!;

  return (
    <div className="flex flex-col gap-2 mt-1">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i < score ? config.color : "bg-gray-200"
              }`}
            />
          ))}
        </div>
        <span className={`text-caption font-medium ${config.text}`}>
          {t(config.labelKey as never)}
        </span>
      </div>

      {/* Rules checklist */}
      <div className="flex flex-col gap-1">
        {passed.map((rule) => (
          <div key={rule.key} className="flex items-center gap-1.5">
            {rule.passed ? (
              <Check size={12} className="text-green-500 shrink-0" />
            ) : (
              <X size={12} className="text-gray-300 shrink-0" />
            )}
            <span className={`text-caption ${rule.passed ? "text-green-600" : "text-gray-400"}`}>
              {t(rule.labelKey as never)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
