import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const useQueryParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const allParams = useMemo(() => {
    const result: Record<string, string> = {};
    for (const [key, value] of searchParams.entries()) {
      result[key] = value;
    }
    return result;
  }, [searchParams]);

  const page = useMemo(() => {
    const value = Number(searchParams.get("page"));
    return !isNaN(value) && value > 0 ? value : DEFAULT_PAGE;
  }, [searchParams]);

  const limit = useMemo(() => {
    const value = Number(searchParams.get("limit"));
    return !isNaN(value) && value > 0 ? value : DEFAULT_LIMIT;
  }, [searchParams]);

  const query = useMemo(() => {
    const sortedParams = new URLSearchParams();
    Object.keys(allParams)
      .sort()
      .forEach((key) => {
        sortedParams.set(key, allParams[key]);
      });
    return sortedParams.toString();
  }, [allParams]);

  const getParam = (key: string, fallback = "") => {
    return searchParams.get(key) || fallback;
  };

  const getNumberParam = (key: string, fallback: number) => {
    const value = Number(searchParams.get(key));
    return isNaN(value) ? fallback : value;
  };

  const setParam = (key: string, value: string | number) => {
    const params = new URLSearchParams(searchParams);
    params.set(key, String(value));
    if (key !== "page") {
      params.set("page", String(DEFAULT_PAGE));
    }

    const sorted = new URLSearchParams(
      Array.from(params.entries()).sort(([a, b]) => a.localeCompare(b))
    );

    router.push(`?${sorted.toString()}`);
  };

  useEffect(() => {
    if (!ready && searchParams.get("page") && searchParams.get("limit")) {
      setReady(true);
    }
  }, [searchParams, ready]);

  return {
    page,
    limit,
    query,
    allParams,
    getParam,
    getNumberParam,
    setParam,
    ready,
  };
};
