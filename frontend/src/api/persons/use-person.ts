import { useQuery } from "@tanstack/react-query";
import { personService } from "./person-service";

export const usePerson = {
  getPaginatedPersons: ({
    token,
    query,
    enabled,
  }: {
    token: string;

    query: string;
    enabled: boolean;
  }) => {
    return useQuery({
      queryKey: ["persons", query],
      queryFn: () => personService.getAll(token, query),
      enabled,
    });
  },
};
