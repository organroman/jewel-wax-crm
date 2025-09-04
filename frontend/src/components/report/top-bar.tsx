import { Option } from "@/types/form.types";
import { PersonRoleValue } from "@/types/person.types";

import { useRouter, useSearchParams } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { DateRange } from "react-day-picker";
import { BookText, XIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";
import AsyncCombobox from "@/components/shared/async-combobox";
import DateRangePicker from "../shared/date-range-picker";

import { cn, defineFromToDates } from "@/lib/utils";

interface ReportIndicator {
  label: string;
  labelShort: string;
  value: string | number | null;
  color: string;
}
type Person = {
  id: number;
  fullname: string;
};

interface TopBarProps {
  indicators: ReportIndicator[];
  setPersonSearchQuery?: Dispatch<SetStateAction<string>>;
  persons?: Person[];
  isLoading?: boolean;
  debouncedSetSearch?: (val: string) => void;
  selectOptions?: { value: string; label: string }[];
  selectPlaceholder?: string;
  paramOfSelect?: string;
  filterLabel?: string;
  role: PersonRoleValue;
}

const TopBar = ({
  indicators,
  setPersonSearchQuery,
  persons,
  isLoading,
  debouncedSetSearch,
  selectOptions,
  selectPlaceholder,
  paramOfSelect,
  filterLabel,
  role,
}: TopBarProps) => {
  const { t } = useTranslation();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [inputValue, setInputValue] = useState<string>("");
  const [selectedPerson, setSelectedPerson] = useState<Option<Person> | null>(
    null
  );

  const canViewPersonsFilter = role === "super_admin";

  const currentParamOfSelect = paramOfSelect && searchParams.get(paramOfSelect);

  const [selectedValue, setSelectedValue] = useState<string>(
    currentParamOfSelect ?? ""
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
    debouncedSetSearch && debouncedSetSearch(val);
  };

  const onPersonChange = (opt: Option<Person> | null) => {
    setSelectedPerson(opt);
    setPersonSearchQuery && setPersonSearchQuery("");
  };

  const handleGenerateReport = () => {
    const current = new URLSearchParams(searchParams);
    if (date?.from && date.to) {
      if (date.from === startFrom && date.to === finishTo) {
        return;
      }

      current.set("from", dayjs(date.from).format("YYYY-MM-DD"));
      current.set("to", dayjs(date.to).format("YYYY-MM-DD"));
    }

    if (selectedPerson?.data) {
      current.set("person_id", selectedPerson.data.id.toString());
    } else current.delete("person_id");

    if (paramOfSelect) {
      if (selectedValue) {
        current.set(paramOfSelect, selectedValue);
      } else current.delete(paramOfSelect);
    }
    router.replace(`?${current.toString()}`);
  };

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:gap-5 lg:items-center w-full">
        <DateRangePicker
          date={date}
          setDate={setDate}
          today={finishTo}
          startOfMonth={startFrom}
        />
        <div className="flex flex-row gap-2.5 items-center">
          {persons && canViewPersonsFilter && (
            <AsyncCombobox
              options={persons.map((p) => ({
                data: p,
                label: p.fullname,
                value: p.id,
              }))}
              displayKey="fullname"
              placeholder={t("person.roles.all")}
              value={selectedPerson}
              valueKey="id"
              label={t("person.person")}
              search={inputValue}
              setSearch={(val: string) => handleInputChange(val)}
              onChange={(data) => onPersonChange(data ?? null)}
              isLoading={isLoading}
              triggerHeight="h-9"
              labelPosition="top"
              popoverContentClassName="min-w-[240px] max-w-[240px] !border mt-1 !border-ui-border !shadow-md !rounded-sm"
            />
          )}
          {selectOptions && (
            <div className="flex flex-col gap-1">
              <InfoLabel className="text-sm/3.5">{filterLabel}</InfoLabel>
              <Select
                value={selectedValue}
                onValueChange={(value) => {
                  if (value === "__clear__") {
                    setSelectedValue("");
                  } else {
                    setSelectedValue(value);
                  }
                }}
              >
                <SelectTrigger
                  className="w-[240px] h-9 bg-ui-sidebar"
                  id="selectedValue"
                >
                  <SelectValue placeholder={selectPlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  {selectedValue && (
                    <SelectItem
                      value="__clear__"
                      className={cn(
                        "text-action-minus focus:text-action-minus focus:bg-accent-pink"
                      )}
                    >
                      <XIcon className="text-action-minus group-hover:text-action-alert" />
                      {t("buttons.clear")}
                    </SelectItem>
                  )}
                  {selectOptions.map((option) => {
                    return (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}
          <Button
            className="self-end flex lg:hidden rounded-xs"
            onClick={handleGenerateReport}
          >
            <BookText className=" rotate-180" />
            {t("buttons.generate")}
          </Button>
        </div>

        <Button
          className="self-end hidden lg:flex rounded-xs"
          onClick={handleGenerateReport}
        >
          <BookText className=" rotate-180" />
          {t("buttons.generate")}
        </Button>
      </div>
      <div className="flex flex-row justify-between border-b-2 border-brand-default w-full lg:w-3/4 ">
        {indicators.map((indicator) => {
          return (
            <div
              key={`${indicator.value}-${indicator.label}`}
              className="flex flex-col gap-1.5 items-center"
            >
              <InfoLabel className="text-sm hidden lg:flex">
                {indicator.label}
              </InfoLabel>
              <InfoLabel className="text-sm flex lg:hidden">
                {indicator.labelShort}
              </InfoLabel>
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
