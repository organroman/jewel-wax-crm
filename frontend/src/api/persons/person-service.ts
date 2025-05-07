import {
  CreatePersonInput,
  SafePerson,
  UpdatePersonInput,
} from "@/types/person.types";
import apiService from "../api-service";

export const personsApi = {
  getAll: (token: string, query?: string) =>
    apiService.get<SafePerson[]>(`/persons${query}`, { Authorization: token }),

  getById: (id: number) => apiService.get<SafePerson>(`/persons/${id}`),

  create: (data: CreatePersonInput) =>
    apiService.post<SafePerson>("/persons", data),

  update: (id: number, data: UpdatePersonInput) =>
    apiService.patch<SafePerson>(`/persons/${id}`, data),

  delete: (id: number) => apiService.delete(`/persons/${id}`),
};
