import { SortOption } from "@/types/shared.types";

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
  options: SortOption[];
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const sortByParam = searchParams.get(param) || "created_at-desc";
  const orderParam = searchParams.get("order");
  const current =
    orderParam !== null ? `${sortByParam}-${orderParam}` : sortByParam;

  const handleSortChange = (value: string) => {
    const [sortBy, orderBy] = value.split("-");

    const params = new URLSearchParams(searchParams);
    params.set(param, sortBy);
    if (orderBy) {
      params.set("order", orderBy);
    } else params.delete("order");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-text-light font-semibold focus-visible:outline-none">
        {t("dictionary.sorting")}:
      </span>
      <Select
        defaultValue={current}
        value={current}
        onValueChange={handleSortChange}
      >
        <SelectTrigger className="w-fit p-0 text-xs font-semibold outline-none border-none shadow-none focus:ring-0 focus:outline-none focus-visible:ring-0 dark:hover:bg-transparent">
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
