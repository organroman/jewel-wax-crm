import { EnumItem } from "@/types/shared.types";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useTranslation } from "react-i18next";

const Sort = ({
  param = "sortBy",
  options = [],
}: {
  param?: string;
  options: EnumItem<string>[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const current = searchParams.get(param) || "created_at";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set(param, value);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex w-[164px] items-center gap-2">
      <span className="text-xs text-text-light font-semibold focus-visible:outline-none">
        {t("dictionary.sorting")}:
      </span>
      <Select defaultValue={current} onValueChange={handleSortChange}>
        <SelectTrigger className="w-fit p-0 text-xs font-semibold outline-none border-none shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border-none shadow-md text-xs">
          {options.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default Sort;
