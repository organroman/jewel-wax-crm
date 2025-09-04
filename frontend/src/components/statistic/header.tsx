import { Option } from "@/types/form.types";
import { OrderCustomer } from "@/types/order.types";

import React, { useEffect, useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import debounce from "lodash.debounce";
import { BookText } from "lucide-react";
import dayjs from "dayjs";

import { usePerson } from "@/api/person/use-person";

import { Button } from "../ui/button";

import DateRangePicker from "../shared/date-range-picker";
import InfoLabel from "../shared/typography/info-label";
import AsyncCombobox from "../shared/async-combobox";
import FilterStaticCombobox from "../shared/filter/filter-static-combobox";

import { defineFromToDates, getFullName } from "@/lib/utils";

const Header = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedCustomer, setSelectedCustomer] =
    useState<Option<OrderCustomer> | null>(null);
  const [selectedPerformer, setSelectedPerformer] = useState<number | null>(
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

  const debouncedSetSearch = useMemo(
    () => debounce((val: string) => setSearchQuery(val), 500),
    []
  );
  useEffect(() => () => debouncedSetSearch.cancel(), [debouncedSetSearch]);

  const handleInputChange = (val: string) => {
    setInputValue(val);
    debouncedSetSearch(val);
  };

  const { data: customers, isLoading } = usePerson.getCustomers(
    `role=client&search=${searchQuery}`,
    true
  );
  const { data: modellers = [], isLoading: modellersLoading } =
    usePerson.getModellers("role=modeller");
  const { data: millers = [], isLoading: millersLoading } =
    usePerson.getMillers("role=miller");
  const { data: printers = [], isLoading: printersLoading } =
    usePerson.getPrinters("role=print");

  let performerOptions: { value: number; label: string }[] = [];

  if (!modellersLoading && !millersLoading && !printersLoading) {
    [...modellers, ...millers, ...printers].forEach((performer) => {
      const isInOption = performerOptions.find(
        (op) => op.value === performer.id
      );
      if (isInOption) {
        return;
      } else
        performerOptions.push({
          value: performer.id,
          label: performer.fullname,
        });
    });
  }
  const onPersonChange = (opt: Option<OrderCustomer> | null) => {
    setSelectedCustomer(opt);
  };

  useEffect(() => {
    const current = new URLSearchParams(searchParams);
    if (date?.from && date.to) {
      if (date.from === startFrom && date.to === finishTo) {
        return;
      }

      current.set("from", dayjs(date.from).format("YYYY-MM-DD"));
      current.set("to", dayjs(date.to).format("YYYY-MM-DD"));
    }
    router.replace(`?${current.toString()}`);
  }, []);

  const handleGenerateReport = () => {
    const current = new URLSearchParams(searchParams);
    if (date?.from && date.to) {
      if (date.from === startFrom && date.to === finishTo) {
        return;
      }

      current.set("from", dayjs(date.from).format("YYYY-MM-DD"));
      current.set("to", dayjs(date.to).format("YYYY-MM-DD"));
    }

    if (selectedCustomer?.data) {
      current.set("customer_id", selectedCustomer.data.id.toString());
    } else current.delete("customer_id");

    if (selectedPerformer) {
      current.set("performer_id", selectedPerformer.toString());
    } else current.delete("performer_id");

    router.replace(`?${current.toString()}`);
  };

  const handleSelectPerformer = (param: string, value: string) => {
    setSelectedPerformer(
      selectedPerformer === Number(value) ? null : Number(value)
    );
  };

  const isChecked = (value: string) => {
    return selectedPerformer === Number(value);
  };

  const selectedPerformerLabel = selectedPerformer
    ? performerOptions.find((p) => p.value === selectedPerformer)?.label
    : null;

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-between mt-5">
      <div className="flex flex-col gap-2.5 lg:flex-row lg:gap-5 lg:items-center w-full">
        <DateRangePicker
          date={date}
          setDate={setDate}
          today={finishTo}
          startOfMonth={startFrom}
          className="rounded-sm"
        />
        <div className="flex flex-row gap-5 items-center">
          <AsyncCombobox
            options={
              customers?.data
                ? customers?.data.map((p) => ({
                    data: p,
                    label: getFullName(p.first_name, p.last_name, p.patronymic),
                    value: p.id,
                  }))
                : []
            }
            displayFn={(option) =>
              getFullName(
                option.first_name,
                option.last_name,
                option.patronymic
              )
            }
            placeholder={t("statistic.all_customers")}
            value={selectedCustomer}
            valueKey="id"
            label={t("statistic.customer")}
            search={inputValue}
            setSearch={(val: string) => handleInputChange(val)}
            onChange={(data) => onPersonChange(data ?? null)}
            isLoading={isLoading}
            triggerHeight="h-9"
            labelPosition="top"
            className="rounded-sm"
            popoverContentClassName="min-w-[240px] max-w-[240px] !border mt-1 !border-ui-border !shadow-md !rounded-sm"
          />
          <div className="flex flex-col gap-1">
            <InfoLabel className="text-sm/3.5 font-medium">{t("statistic.performer")}</InfoLabel>
            <FilterStaticCombobox
              open={open}
              handleOpenChange={() => setOpen((prev) => !prev)}
              label={selectedPerformerLabel ?? t("statistic.all_performers")}
              hasSearch
              options={performerOptions}
              param="performer_id"
              handleSelect={handleSelectPerformer}
              isChecked={(value) => isChecked(value)}
              triggerClassName="h-9 min-w-[240px] max-w-[240px] rounded-sm"
              popoverClassName="min-w-[240px] max-w-[240px] !border mt-1 !border-ui-border !shadow-md !rounded-sm"
            />
          </div>
          <Button
            className="self-end flex lg:hidden rounded-sm"
            onClick={handleGenerateReport}
          >
            <BookText className=" rotate-180" />
            {t("buttons.generate")}
          </Button>
        </div>

        <Button
          className="self-end hidden lg:flex rounded-sm"
          onClick={handleGenerateReport}
        >
          <BookText className=" rotate-180" />
          {t("buttons.generate")}
        </Button>
      </div>
    </div>
  );
};

export default Header;
