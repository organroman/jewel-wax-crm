export interface Country {
  id: number;
  name: string;
}

export interface City {
  id: number;
  country_id: number;
  name: string;
}

export interface CreateCountryInput {
  name: string;
}

export interface CreateCityInput {
  name: string;
  country_id: number;
}
