import { API_URL } from "../config";
import Cookies from "js-cookie";

export const uploadService = {
  async uploadImages(files: File[]) {
    const formData = new FormData();
    const token = Cookies.get("token");

    files.forEach((file) => {
      formData.append("images", file);
    });

    const res = await fetch(`${API_URL}/upload/images`, {
      method: "POST",
      credentials: "include",
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const data = await res.json();
    return data;
  },
};
