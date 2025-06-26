export interface NPCity {
  Description: string;
  DescriptionRu: string;
  Ref: string;
  Delivery1: string;
  Delivery2: string;
  Delivery3: string;
  Delivery4: string;
  Delivery5: string;
  Delivery6: string;
  Delivery7: string;
  Area: string;
  SettlementType: string;
  IsBranch: string;
  PreventEntryNewStreetsUser: string;
  Conglomerates: string;
  CityID: string;
  SettlementTypeDescriptionRu: string;
  SettlementTypeDescription: string;
  SpecialCashCheck: string;
  AreaDescription: string;
  AreaDescriptionRu: string;
}

export interface NPResponse<T> {
  success: boolean;
  data: T[];
  errors: any[];
}

export interface NPWarehouse {
  SiteKey: string;
  Description: string;
  DescriptionRu: string;
  ShortAddress: string;
  ShortAddressRu: string;
  Phone: string;
  TypeOfWarehouse: string;
  Ref: string;
  Number: string;
  CityRef: string;
  CityDescription: string;
  CityDescriptionRu: string;
  SettlementRef: string;
  SettlementDescription: string;
  SettlementAreaDescription: string;
  SettlementRegionsDescription: string;
  SettlementTypeDescription: string;
  SettlementTypeDescriptionRu: string;
  Longitude: string;
  Latitude: string;
  PostFinance: string;
  BicycleParking: string;
  PaymentAccess: string;
  POSTerminal: string;
  InternationalShipping: string;
  SelfServiceWorkplacesCount: string;
  TotalMaxWeightAllowed: string;
  PlaceMaxWeightAllowed: string;
  SendingLimitationsOnDimensions: {
    Width: number;
    Height: number;
    Length: number;
  };
  ReceivingLimitationsOnDimensions: {
    Width: number;
    Height: number;
    Length: number;
  };
  Reception: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  Delivery: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  Schedule: {
    Monday: string;
    Tuesday: string;
    Wednesday: string;
    Thursday: string;
    Friday: string;
    Saturday: string;
    Sunday: string;
  };
  DistrictCode: string;
  WarehouseStatus: string;
  WarehouseStatusDate: string;
  WarehouseIllusha: string;
  CategoryOfWarehouse: string;
  Direct: string;
  RegionCity: string;
  WarehouseForAgent: string;
  GeneratorEnabled: string;
  MaxDeclaredCost: string;
  WorkInMobileAwis: string;
  DenyToSelect: string;
  CanGetMoneyTransfer: string;
  HasMirror: string;
  HasFittingRoom: string;
  OnlyReceivingParcel: string;
  PostMachineType: string;
  PostalCodeUA: string;
  WarehouseIndex: string;
  BeaconCode: string;
  Location: string;
}

export interface NPStreet {
  Description: string;
  Ref: string;
  StreetsTypeRef: string;
  StreetsType: string;
}

export interface NPCargoType {
  Description: string;
  Ref: string;
}

export interface CargoType {
  value: string;
  label: string;
}

export interface CreateDeclarationInput {
  Description: string;
  VolumeGeneral: string;
  Weight: string;
  SeatsAmount: string;
  Cost: string;
  PayerType: "Recipient" | "Sender";
  DateTime: string;
  PaymentMethod: "Cash" | "NonCash";
  CargoType: string;
  CitySender: string;
  Sender: string;
  SendersPhone: string;
  SenderAddress: string;
  ContactSender: string;
  CityRecipient: string;
  RecipientAddress?: string;
  RecipientsPhone: string;
  RecipientType: string;
  Recipient: string;
  ContactRecipient: string;
  RecipientFirstName: string;
  RecipientLastName: string;
  OrderId: number;
}

export interface DeliveryDeclaration {
  Ref: string;
  CostOnSite: string;
  EstimatedDeliveryDate: string;
  IntDocNumber: string;
  TypeDocument: string;
}

export interface NPCounterParty {
  Ref: string;
  Description: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Counterparty: string;
  EDRPOU: string;
  CounterpartyType: string;
  ContactPerson: {
    success: boolean;
    data: {
      Ref: string;
      Description: string;
      FirstName: string;
      MiddleName: string;
      LastName: string;
    }[];
  };
}

export interface NPAddress {
  Warehouses: number;
  MainDescription: string;
  Area: string;
  Region: string;
  SettlementTypeCode: string;
  Ref: string;
  DeliveryCity: string;
}

export interface NPSettlement {
  TotalCount: string;
  Addresses: NPAddress[];
}
