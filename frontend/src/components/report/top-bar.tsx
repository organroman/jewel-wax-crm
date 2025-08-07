import { Option } from "@/types/form.types";

import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRange } from "react-day-picker";
import { BookText } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";

import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";
import AsyncCombobox from "@/components/shared/async-combobox";
import DateRangePicker from "./date-range-picker";

import { cn, defineFromToDates } from "@/lib/utils";

interface ReportIndicator {
  label: string;
  value: string | number | null;
  color: string;
}
type Person = {
  id: number;
  fullname: string;
};

interface TopBarProps {
  setPersonSearchQuery: Dispatch<SetStateAction<string>>;
  indicators: ReportIndicator[];
  persons: Person[];
  isLoading: boolean;
  debouncedSetSearch: (val: string) => void;
}

const TopBar = ({
  indicators,
  setPersonSearchQuery,
  persons,
  isLoading,
  debouncedSetSearch,
}: TopBarProps) => {
  const { t } = useTranslation();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [inputValue, setInputValue] = useState<string>("");
  const [selectedPerson, setSelectedPerson] = useState<Option<Person> | null>(
    null
  );

  const { startFrom, finishTo } = defineFromToDates(
    searchParams.get("from"),
    searchParams.get("to")
  );

  const [date, setDate] = useState<DateRange>({
    from: startFrom,
    to: finishTo,
  });

  const handleInputChange = (val: string) => {
    setInputValue(val);
    debouncedSetSearch(val);
  };

  const onPersonChange = (opt: Option<Person> | null) => {
    setSelectedPerson(opt);
    setPersonSearchQuery("");
  };

  const handleGenerateReport = () => {
    const current = new URLSearchParams(searchParams);
    if (date?.from && date.to) {
      if (date.from === startFrom && date.to === finishTo) {
        return;
      }
      current.set("from", date.from.toISOString().split("T")[0]);
      current.set("to", date.to.toISOString().split("T")[0]);
    }

    if (selectedPerson?.data) {
      current.set("person_id", selectedPerson.data.id.toString());
    } else current.delete("person_id");
    router.replace(`?${current.toString()}`);
  };

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row gap-5 items-center w-full">
        <DateRangePicker
          date={date}
          setDate={setDate}
          today={finishTo}
          startOfMonth={startFrom}
        />

        <AsyncCombobox
          options={persons.map((p) => ({
            data: p,
            label: p.fullname,
            value: p.id,
          }))}
          displayKey="fullname"
          value={selectedPerson}
          valueKey="id"
          label={t("person.person")}
          search={inputValue}
          setSearch={(val: string) => handleInputChange(val)}
          onChange={(data) => onPersonChange(data ?? null)}
          isLoading={isLoading}
          triggerHeight="h-9"
          popoverContentClassName="min-w-[240px] max-w-[240px] !border mt-1 !border-ui-border !shadow-md !rounded-sm"
        />
        <Button className="self-end rounded-sm" onClick={handleGenerateReport}>
          <BookText className=" rotate-180" />
          {t("buttons.generate")}
        </Button>
      </div>
      <div className="flex flex-row justify-between border-b-2 border-brand-default w-3/4 ">
        {indicators.map((indicator) => {
          return (
            <div
              key={`${indicator.value}-${indicator.label}`}
              className="flex flex-col gap-1.5 items-center"
            >
              <InfoLabel className="text-sm">{indicator.label}</InfoLabel>
              <InfoValue
                className={cn("text-lg font-semibold", indicator.color)}
              >
                {indicator.value}
              </InfoValue>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopBar;
