import { useTranslation } from "react-i18next";
import MessageIcon from "../../assets/icons/message.svg";

const NewNotificationIndicators = () => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col p-7 items-center justify-center border border-ui-border bg-brand-menu rounded-sm">
      <div className="flex justify-between items-center">
        <div className="flex gap-2.5 items-center">
          <MessageIcon className="text-text-muted !w-9 !h-9 shrink-0" />
          <p className="font-bold text-base/5 whitespace-pre-wrap">
            {t("dashboard.new_notifications")}
          </p>
        </div>
        <h3 className="text-4xl text-brand-default">//</h3>
      </div>
    </div>
  );
};

export default NewNotificationIndicators;
