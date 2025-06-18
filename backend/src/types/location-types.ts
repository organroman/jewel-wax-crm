export interface Country {
  id: number;
  name: string;
}

export interface City {
  id?: number;
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
