import { NPCity, NPResponse, Warehouse } from "../types/novaposhta.types";
import { axiosClient } from "../utils/axiosClient";

const apiKey = process.env.NOVA_POSHTA_API_KEY;

export const NovaPoshtaModel = {
  async getCities(search: string): Promise<NPResponse<NPCity>> {
    const res = await axiosClient.post("", {
      apiKey,
      modelName: "Address",
      calledMethod: "getCities",
      methodProperties: {
        FindByString: search,
      },
    });

    return res.data;
  },

  async getWarehouses(cityRef: string): Promise<NPResponse<Warehouse>> {
    const res = await axiosClient.post("", {
      apiKey,
      modelName: "Address",
      calledMethod: "getWarehouses",
      methodProperties: {
        CityRef: cityRef,
      },
    });

    return res.data;
  },
};
