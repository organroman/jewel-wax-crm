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
  }: {
    queryClient: QueryClient;
    handleOnSuccess?: (data: Person) => void;
  }) => {
    const mutation = useMutation<Person, Error, CreatePersonSchema>({
      mutationFn: async (data) => personService.create(data),
      onSuccess: (data) => {
        toast.success("Контрагента створено");
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
  }: {
    queryClient: QueryClient;
    handleOnSuccess?: (data: Person) => void;
  }) => {
    const mutation = useMutation<
      Person,
      Error,
      UpdatePersonSchema 
    >({
      mutationFn: async (data) => personService.update(data),
      onSuccess: (data) => {
        toast.success("Контрагента оновлено");
        queryClient.invalidateQueries({
          queryKey: ["persons"],
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
  }: {
    queryClient: QueryClient;
    handleSuccess?: () => void;
  }) => {
    const mutation = useMutation({
      mutationFn: async (id: number) => personService.delete(id),
      onSuccess: () => {
        toast.success("Контрагента видалено"),
          handleSuccess && handleSuccess(),
          queryClient.invalidateQueries({
            queryKey: ["persons"],
          });
      },
      onError: (error) => toast.error(error.message),
    });
    return { deletePersonMutation: mutation };
  },
};
