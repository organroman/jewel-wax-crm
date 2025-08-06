import { DeliveryAddress, Phone } from "@/types/person.types";
import { Option } from "@/types/form.types";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { BookText } from "lucide-react";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";

import { usePerson } from "@/api/person/use-person";

import { Button } from "@/components/ui/button";

import InfoLabel from "@/components/shared/typography/info-label";
import InfoValue from "@/components/shared/typography/info-value";
import AsyncCombobox from "@/components/shared/async-combobox";

import { cn, getFullName } from "@/lib/utils";
import DateRangePicker from "./date-range-picker";

interface ReportIndicator {
  label: string;
  value: string | number | null;
  color: string;
}

interface TopBarProps {
  enabled: boolean;
  indicators: ReportIndicator[];
}

type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  patronymic?: string;
  phones: Phone[];
  delivery_addresses: DeliveryAddress[];
};

const TopBar = ({ indicators, enabled }: TopBarProps) => {
  const { t } = useTranslation();

  const searchParams = useSearchParams();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedPerson, setSelectedPerson] = useState<Option<Customer> | null>(
    null
  );

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setSearchQuery(val), 500),
    []
  );

  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const toParam = searchParams.get("to");

  const startOfMonth = new Date(today);
  startOfMonth.setDate(1);
  const fromParam = searchParams.get("from");

  const [date, setDate] = useState<DateRange>({
    from: fromParam ? new Date(fromParam) : startOfMonth,
    to: toParam ? new Date(toParam) : today,
  });

  const { data: customers, isLoading } = usePerson.getCustomers(
    `search=${searchQuery}`,
    enabled
  );

  const handleInputChange = (val: string) => {
    setInputValue(val);
    debouncedSetSearch(val);
  };

  const onPersonChange = (opt: Option<Customer> | null) => {
    setSelectedPerson(opt);
    setSearchQuery("");
  };

  const handleGenerateReport = () => {
    const current = new URLSearchParams(searchParams);
    if (date?.from && date.to) {
      if (date.from === startOfMonth && date.to === today) {
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
          today={today}
          startOfMonth={startOfMonth}
        />

        <AsyncCombobox
          options={
            customers?.data
              ? customers.data.map((p) => ({
                  data: p,
                  value: p.id,
                  label: getFullName(p.first_name, p.last_name, p.patronymic),
                }))
              : []
          }
          displayFn={(c) =>
            getFullName(c.first_name, c.last_name, c.patronymic)
          }
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
      <div className="flex flex-row justify-between border-b-2 border-brand-default w-1/2">
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
