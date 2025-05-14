import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import { ChanelSource } from "@/types/shared.types";

import { MESSENGERS_SOURCE_ICONS } from "@/constants/persons.constants";
import { toast } from "sonner";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(firstName: string, lastName: string) {
  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
}

export function getFullName(
  firstName: string,
  lastName: string,
  surname: string | undefined
) {
  let fullname = lastName.toUpperCase() + " " + firstName.toUpperCase();

  if (surname) {
    fullname = fullname + " " + surname.toUpperCase;
  }

  return fullname;
}

type SupportedMessengerPlatform = keyof typeof MESSENGERS_SOURCE_ICONS;

export const getMessengerIcon = (platform: ChanelSource): string | null => {
  if (platform in MESSENGERS_SOURCE_ICONS) {
    return MESSENGERS_SOURCE_ICONS[platform as SupportedMessengerPlatform];
  }
  return null;
};

export const formatPhone = (raw: string): string => {
  const phone = parsePhoneNumberFromString(raw);
  return phone?.formatInternational() ?? raw;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    toast.error("Failed to copy");
    return false;
  }
};
