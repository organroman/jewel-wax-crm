import { Dispatch, SetStateAction, useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import i18nextConfig from "../../../next-i18next.config";

import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";

import { dateFnsLocaleMap } from "@/lib/date-fns-locale-map";
import { cn } from "@/lib/utils";

interface DateRangePicker {
  date: DateRange | undefined;
  setDate: Dispatch<SetStateAction<DateRange>>;
  today: Date;
  startOfMonth: Date;
}

const DateRangePicker = ({
  date,
  today,
  startOfMonth,
   setDate,
}: DateRangePicker) => {
  const { t } = useTranslation();
  const currentLanguage = i18n.language || i18nextConfig.i18n.defaultLocale;
  const locale = dateFnsLocaleMap[currentLanguage] || dateFnsLocaleMap["ua"];

  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(date?.from ?? today);
  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="date" className="px-1">
        {t("report.period")}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className={cn(
              "w-fit justify-between font-normal text-sm rounded-xs",
              date && "text-text-regular font-medium"
            )}
          >
            <CalendarIcon />
            {date?.from
              ? date.to
                ? `${date.from.toLocaleDateString()} - ${date.to.toLocaleDateString()}`
                : date.from.toLocaleDateString()
              : "Select date range"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="range"
            selected={date}
            month={month}
            onMonthChange={setMonth}
            captionLayout="dropdown"
            defaultMonth={date?.from}
            locale={locale}
            components={{
              Footer: () => (
                <tfoot>
                  <tr>
                    <td colSpan={7}>
                      <div className="pt-2 border-t w-full flex">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full text-sm"
                          onClick={() => {
                            setDate({ from: startOfMonth, to: today });
                            setMonth(today);
                          }}
                        >
                          {t("report.clear_period")}
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              ),
            }}
            onSelect={(range) => {
              if (range?.from && range?.to) {
                setDate({
                  from: range.from,
                  to: range.to,
                });
              }
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default DateRangePicker;
