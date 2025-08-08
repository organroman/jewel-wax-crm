import { PersonRoleValue } from "@/types/person.types";
import { ChanelSource } from "@/types/shared.types";

import jwt, { JwtPayload } from "jsonwebtoken";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { toast } from "sonner";

import AppError from "./app-error";
import { MESSENGERS_SOURCE_ICONS } from "@/constants/persons.constants";
import ERROR_MESSAGES from "@/constants/error-messages";
import { OrderDelivery } from "@/types/order.types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(firstName: string, lastName: string) {
  return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
}

export function getDoorAddress(
  street?: string | null,
  house?: string | null,
  flat?: string | null
): string {
  return [street, house, flat].filter(Boolean).join(" ,");
}

export function getFullName(
  firstName: string,
  lastName: string,
  surname: string | undefined | null,
  isUpperCase?: boolean
) {
  if (isUpperCase) {
    let fullname = lastName.toUpperCase() + " " + firstName.toUpperCase();

    if (surname) {
      fullname = fullname + " " + surname.toUpperCase();
    }

    return fullname;
  } else {
    let fullname = lastName + " " + firstName;

    if (surname) {
      fullname = fullname + " " + surname;
    }

    return fullname;
  }
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
  if (typeof window === "undefined" || !navigator?.clipboard) {
    // You’re on the server or clipboard API is not available
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    toast.error("Failed to copy");
    return false;
  }
};

export const toggleParam = (
  searchParams: string,
  param: string,
  value: string | boolean,
  router: AppRouterInstance
) => {
  const current = new URLSearchParams(searchParams);
  const valueStr = String(value);
  const values = current.get(param)?.split(",").filter(Boolean) || [];

  const updated = values.includes(valueStr)
    ? values.filter((v) => v !== valueStr)
    : [...values, valueStr];

  if (updated.length > 0) {
    current.set(param, updated.join(","));
  } else {
    current.delete(param);
  }
  router.push(`?${current.toString()}`);
};

export const checkPermission = (
  allowedRoles: PersonRoleValue[],
  role: PersonRoleValue
) => {
  if (!role) throw new AppError(ERROR_MESSAGES.UNAUTHORIZED, 401);

  return allowedRoles.includes(role);
};

interface TokenPayload extends JwtPayload {
  // userId: string;
  role: PersonRoleValue;
}

const secret = process.env.NEXT_PUBLIC_JWT_SECRET;

export const getRoleAndUserFromToken = (token: PersonRoleValue) => {
  if (!token || typeof token !== "string") {
    throw new Error("Invalid token provided");
  }

  if (!secret) {
    throw new Error("Invalid token provided");
  }

  const decoded = jwt.verify(token, secret);

  if (typeof decoded !== "object" || decoded === null || !("role" in decoded)) {
    throw new Error("Invalid token payload: missing role");
  }

  const { id, role } = decoded as TokenPayload;

  return { id, role };
};

export const hasPermission = (permission: string[], role: string) => {
  return permission.includes(role);
};

export const defineDeliveryPayload = (delivery?: OrderDelivery | null) => {
  let deliveryPayload;

  if (delivery?.delivery_address_id) {
    deliveryPayload = {
      ...delivery,
      declaration_number:
        delivery.declaration_number !== "" ? delivery.declaration_number : null,
    };
  } else if (delivery?.is_third_party) {
    deliveryPayload = {
      ...delivery,
      delivery_address_id: delivery.delivery_address_id ?? null,
      declaration_number:
        delivery.declaration_number !== "" ? delivery.declaration_number : null,
    };
  } else deliveryPayload = null;

  return deliveryPayload;
};

export const formatFileSize = (bytes: number, decimals = 1): string => {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = bytes / Math.pow(k, i);

  return `${parseFloat(size.toFixed(decimals))} ${sizes[i]}`;
};

export function defineFromToDates(from?: string | null, to?: string | null) {
  const today = new Date();

  const startOfMonth = new Date(today);
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const startFrom = from ? new Date(from) : startOfMonth;

  const finishTo = to ? new Date(to) : today;

  startFrom.setHours(0, 0, 0, 0);
  finishTo.setHours(23, 59, 59, 999);

  return { startFrom, finishTo };
}
