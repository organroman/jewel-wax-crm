import { z } from "zod";

export const toggleIsImportantSchema = z.object({
  is_important: z.boolean(),
});
