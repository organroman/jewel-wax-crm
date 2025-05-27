import React from "react";
import { useTranslation } from "react-i18next";

import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";

const PersonFullName = ({ fullName }: { fullName: string }) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center gap-2.5">
      <InfoLabel className="border-r w-32">{t("person.person")}</InfoLabel>
      <InfoValue className="font-semibold">{fullName}</InfoValue>
    </div>
  );
};

export default PersonFullName;
