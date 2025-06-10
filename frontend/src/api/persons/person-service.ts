import {
  CreatePersonSchema,
  Person,
  UpdatePersonSchema,
} from "@/types/person.types";
import apiService from "../api-service";
import { PaginatedResult } from "@/types/shared.types";

export const personService = {
  getAll: async (query: string) => {
    return await apiService.get<PaginatedResult<Person>>(`persons?${query}`);
  },

  getById: async (id: number) => {
    return await apiService.get<Person>(`persons/${id}`);
  },

  create: (data: CreatePersonSchema) =>
    apiService.post<Person>("persons", { ...data, role: data.role.value }),

  update: (data: UpdatePersonSchema) => {
    const payload = { ...data, role: data.role.value };
    return apiService.patch<Person>(`persons/${data.id}`, payload);
  },

  delete: (id: number) => apiService.delete(`persons/${id}`),

  getModellers: async () => {
    return await apiService.get<{ id: number; fullname: string }[]>(
      "persons/modellers"
    );
  },
  getMillers: async () => {
    return await apiService.get<{ id: number; fullname: string }[]>(
      "persons/millers"
    );
  },
  getPrinters: async () => {
    return await apiService.get<{ id: number; fullname: string }[]>(
      "persons/printers"
    );
  },
};
