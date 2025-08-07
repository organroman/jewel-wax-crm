import { QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { personService } from "./person-service";
import {
  CreatePersonSchema,
  Person,
  UpdatePersonSchema,
} from "@/types/person.types";
import { toast } from "sonner";

export const usePerson = {
  getPaginatedPersons: ({
    query,
    enabled,
  }: {
    query: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["persons", query],
      queryFn: () => personService.getAll(query),
      enabled,
    });
  },
  getPersonById: ({ id, enabled }: { id: number; enabled: boolean }) => {
    return useQuery({
      queryKey: ["person", id],
      queryFn: () => personService.getById(Number(id)),
      enabled,
    });
  },
  createPerson: ({
    queryClient,
    handleOnSuccess,
    t,
  }: {
    queryClient: QueryClient;
    handleOnSuccess?: (data: Person) => void;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation<Person, Error, CreatePersonSchema>({
      mutationFn: async (data) => personService.create(data),
      onSuccess: (data) => {
        toast.success(t("messages.success.person_created"));
        queryClient.invalidateQueries({
          queryKey: ["persons"],
        });
        handleOnSuccess && data && handleOnSuccess(data);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    return { createPersonMutation: mutation };
  },
  updatePerson: ({
    queryClient,
    handleOnSuccess,
    t,
  }: {
    queryClient: QueryClient;
    handleOnSuccess?: (data: Person) => void;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation<Person, Error, UpdatePersonSchema>({
      mutationFn: async (data) => personService.update(data),
      onSuccess: (data) => {
        toast.success(t("messages.success.person_updated"));
        queryClient.invalidateQueries({
          queryKey: ["persons"],
        });
        queryClient.invalidateQueries({
          queryKey: ["person", data.id],
        });
        handleOnSuccess && handleOnSuccess(data);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    return { updateMutation: mutation };
  },
  deletePerson: ({
    queryClient,
    handleSuccess,
    t,
  }: {
    queryClient: QueryClient;
    handleSuccess?: () => void;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation({
      mutationFn: async (id: number) => personService.delete(id),
      onSuccess: () => {
        toast.success(t("messages.success.person_deleted"));
        handleSuccess && handleSuccess(),
          queryClient.invalidateQueries({
            queryKey: ["persons"],
          });
      },
      onError: (error) => toast.error(error.message),
    });
    return { deletePersonMutation: mutation };
  },

  getModellers: (query: string, enabled?: boolean) => {
    return useQuery({
      queryKey: ["modellers"],
      queryFn: () => personService.getOrderPerformers(query),
      enabled,
    });
  },
  getMillers: (query: string) => {
    return useQuery({
      queryKey: ["millers"],
      queryFn: () => personService.getOrderPerformers(query),
    });
  },
  getPrinters: (query: string) => {
    return useQuery({
      queryKey: ["printers"],
      queryFn: () => personService.getOrderPerformers(query),
    });
  },
  getCustomers: (query: string, enabled: boolean) => {
    return useQuery({
      queryKey: ["customers", query],
      queryFn: () => personService.getCustomers(query),
      enabled,
    });
  },
  getPaginatedPersonsByRole: (query: string, enabled: boolean) => {
    return useQuery({
      queryKey: ["personsByRole", query],
      queryFn: () => personService.getPaginatedPersonsByRole(query),
      enabled,
    });
  },
};
