import React from "react";

export interface LabeledListItem<T = unknown> {
  id: string | number | undefined;

  value: string;
  isMain?: boolean;
  icons?: React.ReactNode[];
  raw?: T;
}

interface PersonLabeledListProps<T = unknown> {
  mainLabel: string;
  secondaryLabel: string;
  items: LabeledListItem<T>[];
  highlightMain?: boolean;
  width?: string;
}

const PersonLabeledList = <T,>({
  mainLabel,
  secondaryLabel,
  items,
  highlightMain = false,
  width,
}: PersonLabeledListProps<T>) => {
  const main = items.find((i) => i.isMain);
  const others = items.filter((i) => !i.isMain);

  return (
    <div className="flex mt-4 gap-2.5">
      <div className="flex flex-col justify-center gap-2.5 w-32 border-r border-ui-border">
        {main && <p className="text-text-muted text-xs">{mainLabel}</p>}
        {others.length > 0 &&
          others.map((item) => (
            <p key={item.id} className="text-text-muted text-xs">
              {secondaryLabel}
            </p>
          ))}
      </div>
      <div className="flex flex-col gap-1 ">
        {main && (
          <div className="flex items-center w-fit gap-2.5">
            <p
              className={`text-sm ${width ? width : "w-34"} font-semibold ${
                highlightMain ? "text-brand-default " : "text-text-regular"
              }`}
            >
              {main.value}
            </p>
            {main.icons && <div className="flex gap-1">{main.icons}</div>}
          </div>
        )}
        {others.length > 0 &&
          others.map((item) => (
            <div key={item.id} className="flex items-center gap-2.5">
              <p className={`text-sm  ${width ? width : "w-34"}`}>
                {item.value}
              </p>
              {item.icons && <div className="flex gap-1">{item.icons}</div>}
            </div>
          ))}
      </div>
    </div>
  );
};

export default PersonLabeledList;
