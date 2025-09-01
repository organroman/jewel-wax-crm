import { ModellerCount } from "@/types/dashboard.types";
import { useTranslation } from "react-i18next";

import { Separator } from "../ui/separator";
import InfoValue from "../shared/typography/info-value";

import CubeIcon from "../../assets/icons/cube.svg";
import { PersonRoleValue } from "@/types/person.types";
import { cn } from "@/lib/utils";

interface ModellerIndicatorsProps {
  modellersCounts: ModellerCount[];
  totalModeling: number;
  role: PersonRoleValue;
}

const ModellerIndicators = ({
  modellersCounts,
  totalModeling,
  role,
}: ModellerIndicatorsProps) => {
  const { t } = useTranslation();

  const isAdmin = role === "super_admin";

  return (
    <div
      className={cn(
        "flex flex-col overflow-y-auto p-7 border border-ui-border bg-accent-lavender rounded-sm",
        isAdmin && "flex-1"
      )}
    >
      <div className="flex justify-between items-center">
        <div className="flex gap-2.5 items-center justify-start">
          <CubeIcon className="text-text-muted !w-9 !h-9 shrink-0" />
          <div className="flex flex-col gap-0.5">
            <p className="font-bold text-base/5 whitespace-pre-wrap">
              {t("dashboard.modeling")}
            </p>
            <p className="text-text-muted text-base/5 whitespace-pre-wrap">
              {t("dashboard.modellers")}
            </p>
          </div>
        </div>
        <h3 className="text-4xl text-brand-default">{totalModeling}</h3>
      </div>
      <Separator className="bg-brand-dark h-0.5 data-[orientation=horizontal]:h-0.5 mt-2.5" />
      <div className="flex flex-col w-full mt-6 gap-6">
        {modellersCounts.map((m) => {
          return (
            <div className="flex items-center justify-between" key={m.fullname}>
              <InfoValue className="text-sm">{m.fullname}</InfoValue>
              <InfoValue className="text-sm">{m.count}</InfoValue>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ModellerIndicators;
