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
  getPersonById: ({ id }: { id: string }) => {
    return useQuery({
      queryKey: ["person", id],
      queryFn: () => personService.getById(Number(id)),
    });
  },
};
