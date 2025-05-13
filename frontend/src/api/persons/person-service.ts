import { Person } from "@/types/person.types";
import apiService from "../api-service";
import { PaginatedResult } from "@/types/shared.types";

export const personService = {
  getAll: async (query: string) => {
    return await apiService.get<PaginatedResult<Person>>(`persons?${query}`);
  },

  getById: async (id: number) => {
    return await apiService.get<Person>(`persons/${id}`);
  },

  // create: (data: CreatePersonInput) =>
  //   apiService.post<SafePerson>("/persons", data),

  // update: (id: number, data: UpdatePersonInput) =>
  //   apiService.patch<SafePerson>(`/persons/${id}`, data),

  // delete: (id: number) => apiService.delete(`/persons/${id}`),
};
