import { useMutation } from "@tanstack/react-query";
import { uploadService } from "./upload-service";
import { ResultUploadedFile } from "@/types/upload.types";

export const useUpload = {
  uploadImages: () => {
    const mutation = useMutation<ResultUploadedFile[], Error, File[]>({
      mutationFn: async (data) => await uploadService.uploadImages(data),
      onSuccess: (data) => {
        return data;
      },
    });
    return { uploadImagesMutation: mutation };
  },
};
