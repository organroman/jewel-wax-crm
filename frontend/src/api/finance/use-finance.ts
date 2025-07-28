import { CreateInvoiceSchema, Invoice } from "@/types/finance.types";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { financeService } from "./finance-service";

export const useFinance = {
  createInvoice: ({
    queryClient,
    handleOnSuccess,
    t,
  }: {
    queryClient: QueryClient;
    handleOnSuccess?: (data: Invoice) => void;
    t: (key: string) => string;
  }) => {
    const mutation = useMutation<Invoice, Error, CreateInvoiceSchema>({
      mutationFn: async (data) => financeService.createInvoice(data),
      onSuccess: (data) => {
        toast.success(t("messages.success.invoice_created"));
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        });
        handleOnSuccess && data && handleOnSuccess(data);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
    return { createInvoiceMutation: mutation };
  },
};
