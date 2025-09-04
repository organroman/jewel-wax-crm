import {
  CreatePersonSchema,
  Person,
  UpdatePersonSchema,
  User,
} from "@/types/person.types";
import apiService from "../api-service";
import { PaginatedResult } from "@/types/shared.types";
import { OrderCustomer } from "@/types/order.types";

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

  updateUser: (data: User) => {
    return apiService.patch<Person>(`persons/user/${data.id}`, data);
  },

  delete: (id: number) => apiService.delete(`persons/${id}`),

  getOrderPerformers: async (query: string) => {
    return await apiService.get<{ id: number; fullname: string }[]>(
      `persons/performers?${query}`
    );
  },
  getCustomers: async (query: string) => {
    return await apiService.get<PaginatedResult<OrderCustomer>>(
      `persons/byRole?${query}`
    );
  },
  getPaginatedPersonsByRole: async (query: string) => {
    return await apiService.get<
      PaginatedResult<{
        id: number;
        fullname: string;
      }>
    >(`persons/byRole?${query}`);
  },
};
