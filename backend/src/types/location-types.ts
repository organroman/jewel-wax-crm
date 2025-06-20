export interface Country {
  id: number;
  name: string;
}

export interface City {
  id: number;
  country_id?: number;
  name: string;
  ref: string;
  area_ref: string;
  area: string;
  settlementType_ref: string;
  settlementType: string;
}

export interface CreateCountryInput {
  name: string;
}

export interface CreateCityInput {
  name: string;
  country: {
    label: string;
    value: number;
  };
}

export interface Street {
  street: string;
  street_ref: string;
}

export interface Warehouse {
  np_warehouse_ref: string;
  np_warehouse: string;
  np_warehouse_siteKey: string;
}
