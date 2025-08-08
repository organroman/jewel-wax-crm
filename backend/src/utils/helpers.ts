import {
  Expense,
  ExpenseCategory,
  PaymentMethod,
  PaymentStatus,
} from "../types/finance.type";
import { AdminOrder, UserOrder } from "../types/order.types";
import { PersonRole } from "../types/person.types";

export const formatLabel = (value: string): string => {
  return value
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};

export function stripPassword<T extends { password?: string }>(person: T) {
  const { password, ...safe } = person;
  return safe;
}

export function getDoorAddress(
  street?: string | null,
  house?: string | null,
  flat?: string | null
): string {
  return [street, house, flat].filter(Boolean).join(" ,");
}

export function getFullName(
  first?: string,
  last?: string,
  patronymic?: string
): string {
  return [last, first, patronymic].filter(Boolean).join(" ");
}

export function formatPerson(row: any, prefix: string) {
  const id = row[`${prefix}_id`];
  if (!id) return null;
  return {
    id,
    fullname: getFullName(
      row[`${prefix}_first_name`],
      row[`${prefix}_last_name`],
      row[`${prefix}_patronymic`]
    ),
  };
}

export function getVisibleFieldsForRoleAndContext(role: PersonRole): string[] {
  return [
    "id",
    "number",
    "name",
    "created_at",
    "is_important",
    ...(role === "super_admin"
      ? [
          "customer_id",
          "miller_id",
          "printer_id",
          "modeller_id",
          "amount",
          "payment_status",
          "active_stage",
          "processing_days",
          "notes",
        ]
      : []),
    ...(role === "modeller" ? ["modeller_id", "modeling_cost"] : []),
    ...(role === "miller" ? ["miller_id", "milling_cost"] : []),
  ];
}

export function stripPrivateFields(
  order: AdminOrder | UserOrder,
  user_role: PersonRole
): Partial<AdminOrder | UserOrder> {
  const fieldsToRemove: Partial<Record<PersonRole, string[]>> = {
    modeller: [
      "customer_id",
      "miller_id",
      "printer_id",
      "modeller_id",
      "modeller_first_name",
      "modeller_last_name",
      "modeller_patronymic",
    ],
    miller: [
      "customer_id",
      "modeller_id",
      "printer_id",
      "miller_id",
      "miller_first_name",
      "miller_last_name",
      "miller_patronymic",
    ],
    super_admin: [
      "modeller_id",
      "miller_id",
      "printer_id",
      "customer_id",
      "modeller_first_name",
      "modeller_last_name",
      "modeller_patronymic",
      "miller_first_name",
      "miller_last_name",
      "miller_patronymic",
      "customer_first_name",
      "customer_last_name",
      "customer_patronymic",
      "printer_first_name",
      "printer_last_name",
      "printer_patronymic",
    ],
  };

  const omit = new Set(fieldsToRemove[user_role] || []);
  return Object.fromEntries(
    Object.entries(order).filter(([key]) => !omit.has(key))
  );
}

export function parseDate(input: string): Date {
  const [day, month, year] = input.split(".");
  return new Date(Number(year), Number(month) - 1, Number(day));
}

export function definePaymentStatus(
  totalPaid: number,
  totalAmount: number
): PaymentStatus {
  let status: PaymentStatus;

  if (totalPaid === 0) status = "unpaid";
  else if (totalPaid >= totalAmount) status = "paid";
  else status = "partly_paid";

  return status;
}

type BaseTransaction = {
  payment_method: PaymentMethod;
  created_at?: Date | string | null;
  paid_at?: Date | string | null;
  amount?: number | string | null;
  amount_paid?: number | string | null;
  description?: string | null;
};

interface PaymentCalcOptions {
  amountField: "amount" | "amount_paid";
  dateField: "created_at" | "paid_at";
}

export function definePaymentAmountByPaymentMethod<T extends BaseTransaction>(
  transactions: T[],
  paymentMethod: PaymentMethod | PaymentMethod[],
  options: PaymentCalcOptions
) {
  const methods = Array.isArray(paymentMethod)
    ? paymentMethod
    : [paymentMethod];
  const filteredTransactions = transactions.filter((t) =>
    methods.includes(t.payment_method)
  );
  const transactionsAmount = filteredTransactions.length;

  const transactionsPaymentsAmount = filteredTransactions.reduce(
    (sum, transaction) => sum + Number(transaction[options.amountField] || 0),
    0
  );

  const lastTransaction =
    filteredTransactions.length > 0
      ? filteredTransactions
          .filter((a) => a[options.dateField] !== null)
          .sort((a, b) =>
            (a[options.dateField] as Date) > (b[options.dateField] as Date)
              ? -1
              : 1
          )[0] || null
      : null;

  const transactionLastPaymentDate =
    (lastTransaction?.[options.dateField] as Date) || null;
  const transactionLastComment =
    (lastTransaction?.description as string) || null;

  return {
    transactionsAmount,
    transactionsPaymentsAmount,
    transactionLastPaymentDate,
    transactionLastComment,
  };
}

export function defineFromToDates(from?: string, to?: string) {
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

export function groupBy<T, K extends keyof T>(
  list: T[],
  key: K
): Record<string, T[]> {
  return list.reduce((acc, item) => {
    const groupKey = String(item[key]);
    acc[groupKey] ||= [];
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
}

export function defineTotalExpensesAmountByCategory(
  expenses: Expense[],
  category: ExpenseCategory
) {
  return expenses
    .filter((exp) => exp.category === category)
    .reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
}
