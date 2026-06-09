import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Shield, ArrowLeft, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { notifyError, notifySuccess } from "@/components/shared";
import { routes } from "@/routes/paths";
import { authApi } from "@/api";
import { useAuthStore } from "@/store";

interface LocationState {
  account?: string;
  password?: string;
}

const Verify2FA = () => {
  const { t } = useTranslation(Namespace.Auth);
  const navigate = useNavigate();
  const location = useLocation();
  const { account, password } = (location.state as LocationState | null) ?? {};
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    if (!account || !password) {
      navigate(`/${routes.LOGIN}`, { replace: true });
    }
  }, [account, password, navigate]);

  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isValid = code.length === 6;

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
  };

  const handleSubmit = async () => {
    if (!isValid || submitting || !account || !password) return;
    setSubmitting(true);
    try {
      const { token, user } = await authApi.login({
        account,
        password,
        twoFactorCode: code,
      });
      setAuth(token, {
        id: user.id,
        account: user.account,
        email: user.email,
        role: user.role,
      });
      notifySuccess(t("verify2fa.success"));
      navigate(`/${routes.DASHBOARD}`, { replace: true });
    } catch (err) {
      notifyError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="h-screen w-full overflow-y-auto bg-[#F9FAFB] font-sans"
      style={{ scrollbarGutter: "stable" }}
    >
      <div className="min-h-full flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-120 flex flex-col items-stretch">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-[#E0E7FF] flex items-center justify-center">
              <Shield size={40} className="text-[#4F39F6]" strokeWidth={2} />
            </div>
            <h1
              className="mt-6 text-[28px] font-semibold text-primary"
              style={{ lineHeight: "36px", letterSpacing: "-0.5px" }}
            >
              {t("verify2fa.title")}
            </h1>
            <p
              className="mt-3 text-[14px] font-normal text-muted"
              style={{ lineHeight: "22px", letterSpacing: "-0.15px" }}
            >
              {t("verify2fa.subtitle")}
            </p>
          </div>

          <div
            className="mt-10 bg-white rounded-2xl flex flex-col px-8 pt-8 pb-7"
            style={{
              boxShadow: "0px 1px 2px -1px rgba(0,0,0,0.1), 0px 1px 3px 0px rgba(0,0,0,0.1)",
            }}
          >
            <div className="flex flex-col items-center gap-1.5 pb-6 border-b border-[#F3F4F6]">
              <span className="text-[14px] font-normal text-muted" style={{ lineHeight: "20px" }}>
                {t("verify2fa.loggedInAs")}
              </span>
              <span
                className="text-[14px] font-semibold text-primary"
                style={{ lineHeight: "22px", letterSpacing: "-0.15px" }}
              >
                {account ?? "—"}
              </span>
            </div>

            <div className="flex flex-col gap-2 mt-6">
              <label
                className="text-[14px] font-medium text-[#364153]"
                style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
              >
                {t("verify2fa.label")}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={code}
                onChange={handleCodeChange}
                placeholder="000000"
                maxLength={6}
                autoFocus
                disabled={submitting}
                className="w-full h-11 rounded-[10px] outline-none focus:border-[#4F39F6] transition-colors px-4 disabled:opacity-60"
                style={{
                  background: "#F3F3F5",
                  border: "1px solid #E5E7EB",
                  boxShadow: "0px 0px 0px 0.48px #A1A1A114",
                  color: "#101828",
                  fontFamily: "Menlo, monospace",
                  fontSize: "15px",
                  letterSpacing: "2px",
                  textAlign: "center",
                }}
              />
              <span
                className="mt-1 text-[13px] font-normal text-secondary text-center"
                style={{ lineHeight: "18px" }}
              >
                {t("verify2fa.helper")}
              </span>
            </div>

            <button
              type="button"
              disabled={!isValid || submitting}
              onClick={handleSubmit}
              className="mt-7 w-full h-12 rounded-[10px] bg-[#4F39F6] text-white text-[15px] font-medium inline-flex items-center justify-center gap-2 hover:bg-[#3F2DE0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              style={{ letterSpacing: "-0.15px", lineHeight: "22px" }}
            >
              {submitting && <Loader2 size={18} className="animate-spin" strokeWidth={2} />}
              {submitting ? t("verify2fa.verifying") : t("verify2fa.verify")}
            </button>

            <button
              type="button"
              onClick={() => navigate(`/${routes.LOGIN}`)}
              className="mt-6 self-center inline-flex items-center gap-2 text-[14px] font-medium text-muted hover:text-primary transition-colors cursor-pointer"
              style={{ letterSpacing: "-0.15px", lineHeight: "20px" }}
            >
              <ArrowLeft size={16} strokeWidth={2} />
              {t("verify2fa.backToLogin")}
            </button>
          </div>

          <div className="mt-10 flex flex-col items-center gap-[14.5px]">
            <span
              className="text-[12px] font-medium text-[#6A7282]"
              style={{ letterSpacing: "-0.15px", lineHeight: "16px" }}
            >
              {t("verify2fa.lostAccess")}
            </span>
            <p
              className="text-[12px] font-normal text-secondary text-center"
              style={{ lineHeight: "16px" }}
            >
              {t("verify2fa.help")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verify2FA;
