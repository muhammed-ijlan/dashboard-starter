import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { CircleCheckBig, Unlock, Shield } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Namespace } from "@/i18n/namespaces";
import { AppCardLayout, notifyError, notifySuccess } from "@/components/shared";
import { routes } from "@/routes/paths";
import { twoFactorApi, queryKeys } from "@/api";
import { useMeQuery } from "@/hooks";
import { UnbindTwoFactorModal } from "./UnbindTwoFactorModal";

export const SecuritySettingsCard = () => {
  const { t, i18n } = useTranslation(Namespace.Profile);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: me } = useMeQuery();
  const twoFactorEnabled = me?.twoFactorEnabled ?? false;
  const lastUpdated = (() => {
    if (!twoFactorEnabled || !me?.twoFactorConfirmedAt) return null;
    const d = new Date(me.twoFactorConfirmedAt);
    if (isNaN(d.getTime())) return null;
    return d.toLocaleString(i18n.language, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  })();

  const [unbindOpen, setUnbindOpen] = useState(false);
  const [unbinding, setUnbinding] = useState(false);

  const handleClickAction = () => {
    if (twoFactorEnabled) {
      setUnbindOpen(true);
    } else {
      navigate(`/${routes.SETUP_2FA}`);
    }
  };

  const handleConfirmUnbind = async (code: string) => {
    setUnbinding(true);
    try {
      await twoFactorApi.disable({ code });
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.all }),
      ]);
      setUnbindOpen(false);
      notifySuccess(t("security.unbind.success"));
    } catch (err) {
      notifyError(err);
      throw err;
    } finally {
      setUnbinding(false);
    }
  };

  return (
    <>
      <AppCardLayout className="w-full mt-2" contentClassName="pt-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield size={20} className="text-[#4F39F6]" />
          <h3
            className="text-[18px] font-semibold text-primary"
            style={{ lineHeight: "27px", letterSpacing: "-0.44px" }}
          >
            {t("security.title")}
          </h3>
        </div>

        <div
          className="rounded-[14px] border border-[#E0E7FF] p-5.25"
          style={{ background: "linear-gradient(90deg, #EEF2FF 0%, #EFF6FF 100%)" }}
        >
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-[10px] bg-[#DCFCE7] text-[#00A63E] flex items-center justify-center shrink-0">
              <CircleCheckBig size={24} strokeWidth={2.2} />
            </div>
            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
              <h4
                className="text-[18px] font-semibold text-primary"
                style={{ lineHeight: "27px", letterSpacing: "-0.44px" }}
              >
                {t("security.twoFactor.title")}
              </h4>
              <p
                className="text-[14px] font-normal text-muted"
                style={{ lineHeight: "20px", letterSpacing: "-0.15px" }}
              >
                {twoFactorEnabled
                  ? t("security.twoFactor.descriptionEnabled")
                  : t("security.twoFactor.descriptionDisabled")}
              </p>
              <div className="flex items-center gap-2 flex-wrap mt-1">
                <span
                  className={`text-[12px] font-medium px-2 py-0.5 rounded-lg ${
                    twoFactorEnabled ? "bg-[#DCFCE7] text-[#008236]" : "bg-[#FFF1F0] text-[#FB3748]"
                  }`}
                  style={{ lineHeight: "16px" }}
                >
                  {twoFactorEnabled
                    ? t("security.twoFactor.enabled")
                    : t("security.twoFactor.notEnabled")}
                </span>
                {lastUpdated && (
                  <span
                    className="text-[12px] font-normal text-secondary"
                    style={{ lineHeight: "16px" }}
                  >
                    {t("security.twoFactor.lastUpdated")}: {lastUpdated}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={handleClickAction}
              className="bg-white border border-[#FFC9C9] text-[#E7000B] rounded-lg px-2.75 py-1.5 inline-flex items-center justify-center gap-3.5 cursor-pointer hover:bg-red-50 transition-colors"
              style={{
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
                letterSpacing: "-0.15px",
              }}
            >
              <Unlock size={16} strokeWidth={2.5} />
              {twoFactorEnabled ? t("security.twoFactor.disable") : t("security.twoFactor.enable")}
            </button>
          </div>
        </div>
      </AppCardLayout>

      <UnbindTwoFactorModal
        open={unbindOpen}
        submitting={unbinding}
        onCancel={() => setUnbindOpen(false)}
        onConfirm={handleConfirmUnbind}
      />
    </>
  );
};
