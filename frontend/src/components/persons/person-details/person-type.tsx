import { useTranslation } from "react-i18next";

import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

import { PERSON_ROLE_COLORS } from "@/constants/persons.constants";
import { PersonRoleValue } from "@/types/person.types";

interface PersonTypeProps {
  value: PersonRoleValue;
  label: string;
}

const PersonType = ({ value, label }: PersonTypeProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex gap-2.5 mt-4 items-center">
      <p className="text-xs text-text-muted w-32 border-r border-ui-border">
        {t("person.person_type")}:
      </p>
      <Badge
        className={cn("text-[10px] rounded-md", PERSON_ROLE_COLORS[value])}
      >
        {label}
      </Badge>
    </div>
  );
};

export default PersonType;
