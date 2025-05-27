import { CountryCode } from "libphonenumber-js";
import { Country } from "./location.types";
import { PersonMessenger } from "./person.types";

import {
  ArrayPath,
  Control,
  FieldErrors,
  FieldValues,
  Path,
  UseFormSetValue,
} from "react-hook-form";
import { Dispatch, SetStateAction } from "react";

export interface FormSwitchProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  checkedLabel: string;
  unCheckedLabel?: string;
}

export type FormPhoneInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  defaultCountry?: CountryCode;
  required?: boolean;
};

export interface FormArrayPhoneProps<T extends FieldValues> {
  name: ArrayPath<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  fieldKey?: string;
  showIsMain?: boolean;
  messengers?: PersonMessenger[];
  errors?: FieldErrors<T>;
}

export type FormInputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  control: Control<T>;
  fieldType?: "input" | "textarea";
  type?: string;
  rows?: number;
  required?: boolean;
};

export type Option<T> = {
  label: string;
  value: string | number;
  data?: T;
};

export type FormSelectProps<T extends FieldValues, O> = {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  control: Control<T>;
  options: Option<O>[];
  required?: boolean;
  className?: string;
};

export interface FormArrayLocationProps<T extends FieldValues> {
  name: ArrayPath<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  countries: Country[];
  onCreateCountry?: () => void;
  onCreateCity?: (countryId: number) => void;
  required?: boolean;
  errors?: FieldErrors<T>;
}

export interface FormArrayInputProps<T extends FieldValues> {
  name: ArrayPath<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  fieldKey?: string;
  showIsMain?: boolean;
  inputClassName?: string;
  errors?: FieldErrors<T>;
}

export interface FormArrayBankDetailsProps<T extends FieldValues> {
  name: ArrayPath<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  required?: boolean;
}

export interface FormComboboxProps<T extends FieldValues, O> {
  name: Path<T>;
  label?: string;
  placeholder?: string;
  control: Control<T>;
  options: Option<O>[];
  required?: boolean;
  className?: string;
  displayKey?: keyof O;
  valueKey?: keyof O;
  saveFullObject?: boolean;
  saveOnlyValue?: boolean;
  disabled?: boolean;
}

export interface FormAsyncComboboxProps<T extends FieldValues, O>
  extends FormComboboxProps<T, O> {
  searchQuery?: string;
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  isOptionsLoading?: boolean;
}

export interface FormArrayComboboxProps<T extends FieldValues, O> {
  name: ArrayPath<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  options: Option<O>[];
  fieldKey?: string;
  displayKey?: keyof O;
  valueKey?: keyof O;
  saveFullObject?: boolean;
  saveOnlyValue?: boolean;
  isShownEmptyInput?: boolean;
  searchQuery?: string;
  setSearchQuery?: Dispatch<SetStateAction<string>>;
  isOptionsLoading?: boolean;
  errors?: FieldErrors<T>;
}
