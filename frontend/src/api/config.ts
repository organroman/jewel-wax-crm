export const API_URL =
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_API_URL}/api`
    : process.env.NEXT_PUBLIC_API_URL;
