import {
  CreateDeclarationInput,
  DeliveryDeclaration,
  NPCargoType,
  NPCity,
  NPCounterParty,
  NPResponse,
  NPSettlement,
  NPStreet,
  NPWarehouse,
} from "../types/novaposhta.types";

import ERROR_MESSAGES from "../constants/error-messages";
import AppError from "../utils/AppError";
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
        Limit: "100",
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

  async getCargoTypes(): Promise<NPResponse<NPCargoType>> {
    const res = await axiosClient.post("", {
      apiKey,
      modelName: "CommonGeneral",
      calledMethod: "getCargoTypes",
      methodProperties: {},
    });
    return res.data;
  },
  async createDeclaration(
    data: CreateDeclarationInput
  ): Promise<NPResponse<DeliveryDeclaration>> {
    const res = await axiosClient.post("", {
      apiKey,
      modelName: "InternetDocumentGeneral",
      calledMethod: "save",
      methodProperties: data,
    });

    const response = res.data;

    if (!response.success) {
      const errorMessage =
        response.errors?.[0] || ERROR_MESSAGES.UNKNOWN_NP_ERROR;
      throw new AppError(errorMessage, 400);
    }

    return res.data;
  },
  async createCounterParty(data: {
    FirstName: string;
    LastName: string;
    Phone: string;
    EDRPOU?: string;
  }): Promise<NPResponse<NPCounterParty>> {
    const res = await axiosClient.post(
      "",
      data.EDRPOU
        ? {
            apiKey,
            modelName: "CounterpartyGeneral",
            calledMethod: "save",
            methodProperties: {
              CounterpartyType: "Organization",
              EDRPOU: data.EDRPOU,
              CounterpartyProperty: "Recipient",
            },
          }
        : {
            apiKey,
            modelName: "CounterpartyGeneral",
            calledMethod: "save",
            methodProperties: {
              FirstName: data.FirstName,
              LastName: data.LastName,
              Phone: data.Phone,
              CounterpartyType: "PrivatePerson",
              CounterpartyProperty: "Recipient",
            },
          }
    );
    return res.data;
  },
  async getSettlements(cityName: string): Promise<NPResponse<NPSettlement>> {
    const res = await axiosClient.post("", {
      apiKey,
      modelName: "AddressGeneral",
      calledMethod: "searchSettlements",
      methodProperties: {
        CityName: cityName,
        Limit: "50",
        Page: "1",
      },
    });

    return res.data;
  },
};
