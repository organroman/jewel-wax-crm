import { FilterGroup } from "@/types/shared.types";

type WithKey = { key: string };

// For arrays like STATIC_PERSON_FILTERS
type TranslatableOption = { key: string; value: string | boolean | number };
type TranslatableFilter = {
  key: string;
  param: string;
  options?: TranslatableOption[];
};

export function translateFilterGroups(
  data: TranslatableFilter[],
  t: (key: string) => string,
  prefix: string
): FilterGroup[] {
  return data.map((item) => {
    const labelKey = `${prefix}.${item.key}`;
    const translated: FilterGroup = {
      param: item.param,
      label: t(`${labelKey}.label`),
    };

    if (item.options) {
      translated.options = item.options.map((opt) => ({
        value: opt.value,
        label: t(`${labelKey}.options.${opt.key}`),
      }));
    }

    return translated;
  });
}
// For single objects like PERSON_ROLE_ALL
export function translateSingleLabel<T extends WithKey>(
  item: T,
  t: (key: string) => string,
  prefix: string
): Omit<T, "key"> & { label: string } {
  const translated = {
    ...item,
    label: t(`${prefix}.${item.key}`),
  };

  delete (translated as any).key;
  return translated;
}
export interface KeyValueItem {
  key: string;
  value: string | number | boolean;
}

export interface LabeledItem {
  value: string;
  label: string;
}

export function translateKeyValueList(
  data: KeyValueItem[],
  t: (key: string) => string,
  prefix: string
): LabeledItem[] {
  return data.map((item) => ({
    value: item.value.toString(),
    label: t(`${prefix}.${item.key}`),
  }));
}
