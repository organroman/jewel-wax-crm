import { Provider } from "../types/chat.types";
import { ProviderAdapter } from "./provider-adapter";
import { telegramAdapter } from "./telegram-adapter";
import AppError from "../utils/AppError";
import ERROR_MESSAGES from "../constants/error-messages";

const registry: Partial<Record<Provider, ProviderAdapter>> = {
  telegram: telegramAdapter,
};

export function getAdapter(provider: string): ProviderAdapter {
  const key = provider.toLowerCase() as Provider;
  const adapter = registry[key];

  if (!adapter) {
    throw new AppError(ERROR_MESSAGES.ADAPTER_NOT_CONFIGURED, 500);
  }
  return adapter;
}
