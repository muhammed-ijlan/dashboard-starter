import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QRCode } from "react-qr-code";
import { Shield, Info, Copy, Check, ShieldCheck, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { notifyError, notifySuccess } from "@/components/shared";
import { routes } from "@/routes/paths";
import { useQueryClient } from "@tanstack/react-query";
import { twoFactorApi, queryKeys } from "@/api";
import { useAuthStore } from "@/store";

interface LocationState {
  setupToken?: string;
  account?: string;
}

const Setup2FA = () => {
  const { t } = useTranslation(Namespace.Profile);
  const navigate = useNavigate();
  const location = useLocation();
  const { setupToken: locationSetupToken } = (location.state as LocationState | null) ?? {};
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
  const setAuth = useAuthStore((s) => s.setAuth);

  const mode: "setup" | "enable" | null = locationSetupToken
    ? "setup"
    : isAuthenticated
      ? "enable"
      : null;

  const [secret, setSecret] = useState<string | null>(null);
  const [otpauthUri, setOtpauthUri] = useState<string | null>(null);
  const [activeSetupToken, setActiveSetupToken] = useState<string | null>(
    locationSetupToken ?? null,
  );
  const [loadingSetup, setLoadingSetup] = useState(true);

  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [skipping, setSkipping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loadingSetup) inputRef.current?.focus();
  }, [loadingSetup]);

  const isValid = code.length === 6;
  useEffect(() => {
    if (mode === null) {
      navigate(`/${routes.LOGIN}`, { replace: true });
      return;
    }

    let cancelled = false;
    (async () => {
      setLoadingSetup(true);
      try {
        if (mode === "setup") {
          const result = await twoFactorApi.setup({ setupToken: locationSetupToken! });
          if (cancelled) return;
          setSecret(result.secret);
          setOtpauthUri(result.otpauthUri);
        } else {
          const result = await twoFactorApi.setupAuthenticated();
          if (cancelled) return;
          setActiveSetupToken(result.setupToken);
          setSecret(result.secret);
          setOtpauthUri(result.otpauthUri);
        }
      } catch (err) {
        if (cancelled) return;
        notifyError(err);
        if (mode === "enable") {
          await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
          await new Promise((resolve) => setTimeout(resolve, 1500));
          if (!cancelled) navigate(`/${routes.ADMIN_PROFILE}`, { replace: true });
        }
      } finally {
        if (!cancelled) setLoadingSetup(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, locationSetupToken, navigate, queryClient]);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
  };

  const handleCopy = async () => {
    if (!secret) return;
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard may be unavailable in some browsers/contexts
    }
  };

  const handleSubmit = async () => {
    if (!isValid || submitting || skipping || !activeSetupToken) return;
    setSubmitting(true);
    try {
      const result = await twoFactorApi.confirm({ setupToken: activeSetupToken, code });
      if (mode === "setup") {
        setAuth(result.token, {
          id: result.user.id,
          account: result.user.account,
          email: result.user.email,
          role: result.user.role,
        });
        navigate(`/${routes.DASHBOARD}`, { replace: true });
      } else {
        navigate(`/${routes.ADMIN_PROFILE}`, { replace: true });
      }
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.all }),
      ]);
      notifySuccess(t("setup2fa.success"));
    } catch (err) {
      notifyError(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSkip = async () => {
    if (submitting || skipping) return;
    if (mode === "enable") {
      navigate(`/${routes.ADMIN_PROFILE}`, { replace: true });
      return;
    }
    if (!activeSetupToken) return;
    setSkipping(true);
    try {
      const { token, user } = await twoFactorApi.skipSetup({ setupToken: activeSetupToken });
      setAuth(token, {
        id: user.id,
        account: user.account,
        email: user.email,
        role: user.role,
      });
      navigate(`/${routes.DASHBOARD}`, { replace: true });
    } catch (err) {
      notifyError(err);
    } finally {
      setSkipping(false);
    }
  };

  return (
    <div
      className="h-screen w-full overflow-y-auto bg-[#F9FAFB] flex justify-center px-4 py-8 font-sans"
      style={{ scrollbarGutter: "stable" }}
    >
      <div className="w-full max-w-2xl flex flex-col self-start">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#E0E7FF] flex items-center justify-center">
            <Shield size={32} className="text-[#4F39F6]" strokeWidth={2} />
          </div>
          <h1
            className="mt-5 text-[24px] font-semibold text-primary"
            style={{ lineHeight: "32px", letterSpacing: "0.07px" }}
          >
            {t("setup2fa.title")}
          </h1>
          <p
            className="mt-2 max-w-md text-[14px] font-normal text-muted"
            style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
          >
            {t("setup2fa.description")}
          </p>
        </div>

        <div
          className="mt-8 bg-white rounded-[14px] flex flex-col gap-8 px-8 py-8"
          style={{
            boxShadow: "0px 1px 1.5px rgba(0,0,0,0.1), 0px 1px 1px rgba(0,0,0,0.1)",
          }}
        >
          <div className="bg-[#EFF6FF] border border-[#DBEAFE] rounded-[10px] px-4 py-4 flex gap-3">
            <Info size={20} className="text-[#1C398E] shrink-0 mt-0.5" strokeWidth={2} />
            <div className="flex flex-col gap-1">
              <p
                className="text-[14px] font-medium text-[#1C398E]"
                style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
              >
                {t("setup2fa.requirement.title")}
              </p>
              <p className="text-[12px] font-normal text-[#1447E6]" style={{ lineHeight: "16px" }}>
                {t("setup2fa.requirement.description")}
              </p>
            </div>
          </div>

          <Step number={1} title={t("setup2fa.step1.title")}>
            <p
              className="text-[14px] font-normal text-muted"
              style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
            >
              {t("setup2fa.step1.description")}
            </p>
          </Step>

          <Step number={2} title={t("setup2fa.step2.title")}>
            <p
              className="text-[14px] font-normal text-muted"
              style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
            >
              {t("setup2fa.step2.description")}
            </p>
            <div className="mt-4 w-57 h-57 bg-white border-2 border-[#E5E7EB] rounded-[14px] p-4 flex items-center justify-center">
              {loadingSetup || !otpauthUri ? (
                <Loader2 size={32} className="text-[#4F39F6] animate-spin" strokeWidth={2} />
              ) : (
                <QRCode value={otpauthUri} size={192} viewBox="0 0 192 192" />
              )}
            </div>
          </Step>

          <Step number={3} title={t("setup2fa.step3.title")}>
            <div className="flex flex-col gap-3">
              <p
                className="text-[14px] font-normal text-muted"
                style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
              >
                {t("setup2fa.step3.description")}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-[10px] px-3 h-11.5 flex items-center">
                  <span
                    className="text-[14px] text-primary"
                    style={{ fontFamily: "Menlo, monospace", lineHeight: "20px" }}
                  >
                    {loadingSetup ? "…" : (secret ?? "—")}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopy}
                  disabled={!secret}
                  className="h-8 px-2.5 bg-white border border-black/10 rounded-lg inline-flex items-center justify-center gap-1.5 text-[14px] font-medium text-[#0A0A0A] hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ letterSpacing: "-0.15px", lineHeight: "20px" }}
                >
                  <span className="relative inline-flex w-4 h-4">
                    <Copy
                      size={16}
                      strokeWidth={2}
                      className="absolute inset-0 transition-all duration-300"
                      style={{
                        opacity: copied ? 0 : 1,
                        transform: copied ? "scale(0.5) rotate(-90deg)" : "scale(1) rotate(0deg)",
                      }}
                    />
                    <Check
                      size={16}
                      strokeWidth={2.2}
                      className="absolute inset-0 text-green-600 transition-all duration-300"
                      style={{
                        opacity: copied ? 1 : 0,
                        transform: copied ? "scale(1) rotate(0deg)" : "scale(0.5) rotate(90deg)",
                      }}
                    />
                  </span>
                  {t("setup2fa.copy")}
                </button>
              </div>
            </div>
          </Step>

          <Step number={4} title={t("setup2fa.step4.title")}>
            <div className="flex flex-col gap-2">
              <p
                className="text-[14px] font-normal text-muted"
                style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
              >
                {t("setup2fa.step4.description")}
              </p>
              <label
                className="mt-1 text-[14px] font-medium text-[#364153]"
                style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
              >
                {t("setup2fa.step4.label")}
              </label>
              <input
                ref={inputRef}
                type="text"
                inputMode="numeric"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                maxLength={6}
                disabled={loadingSetup || submitting || skipping}
                className="w-80 max-w-full h-9 rounded-lg outline-none focus:border-[#4F39F6] transition-colors px-3 disabled:opacity-60"
                style={{
                  background: "#F3F3F5",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0px 0px 0px 0.48px #A1A1A114",
                  color: "#101828",
                  fontFamily: "Menlo, monospace",
                  fontSize: "14px",
                  letterSpacing: "1.4px",
                  textAlign: "center",
                }}
              />
            </div>
          </Step>

          <div className="pt-6 border-t border-[#F3F4F6] flex flex-col gap-3">
            <div className="flex gap-3">
              <button
                type="button"
                disabled={submitting || skipping}
                onClick={handleSkip}
                className="flex-1 h-11 rounded-[10px] bg-white border border-[#D1D5DC] text-[#364153] text-base font-medium leading-6 tracking-[-0.3125px] inline-flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {skipping && <Loader2 size={16} className="animate-spin" strokeWidth={2} />}
                {mode === "enable" ? t("setup2fa.cancel") : t("setup2fa.skip")}
              </button>
              <button
                type="button"
                disabled={!isValid || submitting || skipping || loadingSetup}
                onClick={handleSubmit}
                className="flex-1 h-11 rounded-lg bg-[#4F39F6] text-white text-[14px] font-medium inline-flex items-center justify-center gap-2 hover:bg-[#3F2DE0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                style={{ letterSpacing: "-0.15px", lineHeight: "20px" }}
              >
                {submitting ? (
                  <Loader2 size={16} className="animate-spin" strokeWidth={2} />
                ) : (
                  <ShieldCheck size={16} strokeWidth={2} />
                )}
                {submitting ? t("setup2fa.enabling") : t("setup2fa.enable")}
              </button>
            </div>
            <p
              className="text-center text-[12px] font-normal text-secondary"
              style={{ lineHeight: "16px" }}
            >
              {t("setup2fa.consent")}
            </p>
          </div>
        </div>

        <p
          className="mt-8 text-center text-[12px] font-normal text-secondary"
          style={{ lineHeight: "16px" }}
        >
          {t("setup2fa.help")}
        </p>
      </div>
    </div>
  );
};

const Step = ({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-center gap-2">
      <span className="w-7 h-7 rounded-full bg-[#4F39F6] text-white inline-flex items-center justify-center text-[14px] font-semibold leading-5">
        {number}
      </span>
      <h3
        className="text-[18px] font-semibold text-primary"
        style={{ lineHeight: "27px", letterSpacing: "-0.44px" }}
      >
        {title}
      </h3>
    </div>
    <div className="ml-9">{children}</div>
  </div>
);

export default Setup2FA;
