import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FilterOption } from "@/types/shared.types";

interface CustomTabsProps {
  tabsOptions: FilterOption[];
  isModal?: boolean;
  selectedTab?: FilterOption;
  handleChange?: (value: string) => void;
}

const CustomTabs = ({
  tabsOptions,
  selectedTab,
  handleChange,
  isModal,
}: CustomTabsProps) => {
  const firstTab = tabsOptions[0];

  return (
    <Tabs
      defaultValue={selectedTab?.value as string}
      value={selectedTab?.value as string}
      onValueChange={handleChange}
      // className="mt-2 lg:mt-4"
    >
      <TabsList className="w-full justify-start gap-4 md:gap-6 border-none bg-transparent overflow-x-auto overflow-y-hidden px-1">
        {isModal && (
          <TabsTrigger
            value={firstTab.value as string}
            className="p-0 grow-0 font-semibold pb-5 cursor-pointer text-text-regular data-[state=active]:border-b-2 data-[state=active]:border-brand-default   data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-t-0 border-l-0 border-r-0 data-[state=active]:rounded-none"
          >
            {firstTab.label}
          </TabsTrigger>
        )}
        {!isModal &&
          tabsOptions.map((t) => (
            <TabsTrigger
              key={t.value as string}
              value={t.value as string}
              className="p-0 grow-0 flex items-center font-semibold pb-5 cursor-pointer data-[state=active]:border-b-2 data-[state=active]:border-brand-default   data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent border-t-0 border-l-0 border-r-0 data-[state=active]:rounded-none"
            >
              {t.label}
            </TabsTrigger>
          ))}
      </TabsList>
    </Tabs>
  );
};

export default CustomTabs;
