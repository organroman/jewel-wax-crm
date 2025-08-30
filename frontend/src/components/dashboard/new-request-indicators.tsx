import { useTranslation } from "react-i18next";
import PersonCardIcon from "../../assets/icons/personalcard.svg";
interface NewRequestIndicatorsProps {
  total: number;
}
const NewRequestIndicators = ({ total }: NewRequestIndicatorsProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col p-7 items-center justify-center border border-ui-border bg-accent-grey rounded-sm">
      <div className="flex justify-between w-full items-center">
        <div className="flex gap-2.5 items-center justify-between ">
          <PersonCardIcon className="text-text-regular !w-9 !h-9" />
          <p className="font-bold text-base/5">
            {t("dashboard.new_requests")
              .split(" ")
              .map((word, idx) => (
                <span key={idx} className={idx === 1 ? "block" : "inline"}>
                  {word + " "}
                </span>
              ))}
          </p>
        </div>
        <h3 className="text-4xl text-accent-red">{total}</h3>
      </div>
    </div>
  );
};

export default NewRequestIndicators;
