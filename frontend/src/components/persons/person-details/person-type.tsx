import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";

import { PERSON_ROLE_COLORS } from "@/constants/persons.constants";
import { PersonRoleValue } from "@/types/person.types";

interface PersonTypeProps {
  value: PersonRoleValue;
  label: string;
}

const PersonType = ({ value, label }: PersonTypeProps) => {
  return (
    <div className="flex gap-2.5 mt-4 items-center">
      <p className="text-xs text-text-muted w-32 border-r border-ui-border">
        Тип контрагента:
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
