import AppError from "@/lib/app-error";
import { API_URL } from "./config";
import ERROR_MESSAGES from "@/constants/error-messages";
import Cookies from "js-cookie";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
type HeadersOptions = Record<string, string>;
type BodyOptions = Record<string, any> | null;

interface MakeRequestOptions {
  method?: RequestMethod;
  body?: BodyOptions;
  headers?: HeadersOptions;
  retry?: boolean;
}

const defaultHeaders: HeadersOptions = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const response = await fetch(`${API_URL}/auth/refresh-token`, {
      method: "POST",
      credentials: "include", // ensures cookies are sent
    });

    if (!response.ok) return null;

    const data = await response.json();
    Cookies.set("token", data.token);
    return data.token;
  } catch (error) {
    console.error("Refresh token failed", error);
    return null;
  }
};

const makeRequest = async <T>(
  path: string,
  { method = "GET", body, headers = {}, retry = true }: MakeRequestOptions
): Promise<T> => {
  if (!path) throw new Error("Path not specified");

  const isBodyAllowed = method !== "GET" && method !== "DELETE";
  const token = Cookies.get("token");

  const res = await fetch(`${API_URL}/${path}`, {
    method,
    headers: {
      ...defaultHeaders,
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    credentials: "include",
    body: isBodyAllowed && body ? JSON.stringify(body) : undefined,
  });

  let data;

  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : null;
    // if (res.status !== 204) {
    //   data = await res.json();
    // }
  } catch (error) {
    console.error("Error parsing response:", error);
    throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR, 500);
  }

  if (!res.ok) {
    // 401 → Try refresh once
    if (res.status === 401 && retry) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        return makeRequest<T>(path, {
          method,
          body,
          headers,
          retry: false,
        });
      }
    }

    const message =
      typeof data === "object" && data && "error" in data
        ? (data as { error: string }).error
        : res.statusText;
    throw new AppError(message, res.status);
  }

  return data as T;
};

const apiService = {
  get: <T>(path: string, headers?: HeadersOptions) => {
    return makeRequest<T>(path, { method: "GET", headers });
  },
  post: <T>(path: string, body: BodyOptions, headers?: HeadersOptions) => {
    return makeRequest<T>(path, { method: "POST", body, headers });
  },
  put: <T>(path: string, body: BodyOptions, headers?: HeadersOptions) => {
    return makeRequest<T>(path, { method: "PUT", body, headers });
  },
  patch: <T>(path: string, body: BodyOptions, headers?: HeadersOptions) => {
    return makeRequest<T>(path, { method: "PATCH", body, headers });
  },
  delete: <T>(path: string, headers?: HeadersOptions) => {
    return makeRequest<T>(path, { method: "DELETE", headers });
  },
};

export default apiService;
