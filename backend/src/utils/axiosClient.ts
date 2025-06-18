import axios from "axios";

export const axiosClient = axios.create({
  baseURL: "https://api.novaposhta.ua/v2.0/json/",
  headers: {
    "Content-Type": "application/json",
  },
});
