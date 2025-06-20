import {
  NPCity,
  NPResponse,
  NPStreet,
  NPWarehouse,
} from "../types/novaposhta.types";
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

  async getWarehouses(
    cityRef: string,
    search: string
  ): Promise<NPResponse<NPWarehouse>> {
    const res = await axiosClient.post("", {
      apiKey,
      modelName: "Address",
      calledMethod: "getWarehouses",
      methodProperties: {
        CityRef: cityRef,
        FindByString: search,
        Limit: "50",
        Page: "1",
      },
    });

    return res.data;
  },
  async getCityStreets(
    streetName: string,
    cityRef: string
  ): Promise<NPResponse<NPStreet>> {
    const res = await axiosClient.post("", {
      apiKey,
      modelName: "AddressGeneral",
      calledMethod: "getStreet",
      methodProperties: {
        CityRef: cityRef,
        FindByString: streetName,
        Page: "1",
        Limit: "100",
      },
    });
    return res.data;
  },
};
