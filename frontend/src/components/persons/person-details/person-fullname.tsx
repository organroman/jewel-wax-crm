import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";
import React from "react";

const PersonFullName = ({ fullName }: { fullName: string }) => {
  return (
    <div className="flex items-center gap-2.5">
      <InfoLabel className="border-r w-32">Контрагент:</InfoLabel>
      <InfoValue className="font-semibold">{fullName}</InfoValue>
    </div>
  );
};

export default PersonFullName;
