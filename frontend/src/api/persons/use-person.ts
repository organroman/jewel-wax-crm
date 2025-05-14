import { useQuery } from "@tanstack/react-query";
import { personService } from "./person-service";

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
};
