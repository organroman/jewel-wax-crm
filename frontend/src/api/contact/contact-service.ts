import { PaginatedResult } from "@/types/shared.types";
import apiService from "../api-service";
import { Contact } from "@/types/contact.types";

export const contactService = {
  getAll: async (query: string) => {
    return await apiService.get<PaginatedResult<Contact>>(`contacts?${query}`);
  },
};
