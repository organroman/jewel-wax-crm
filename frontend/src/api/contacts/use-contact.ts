import { useQuery } from "@tanstack/react-query";
import { contactService } from "./contact-service";

export const useContact = {
  getContacts: ({ query }: { query: string }) => {
    return useQuery({
      queryKey: ["contacts", query],
      queryFn: () => contactService.getAll(query),
    });
  },
};
