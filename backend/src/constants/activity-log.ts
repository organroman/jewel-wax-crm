export const LOG_TARGETS = {
  PERSON: "person",
  CONTACT: "contact",
  REQUEST: "request",
  COUNTRY: "country",
  CITY: "city",
} as const;

export const LOG_ACTIONS = {
  CREATE_PERSON: "create_person",
  UPDATE_PERSON: "update_person",
  DELETE_PERSON: "delete_person",
  CREATE_CONTACT: "create_contact",
  UPDATE_CONTACT: "update_contact",
  DELETE_CONTACT: "delete_contact",
  CREATE_REQUEST: "create_request",
  UPDATE_REQUEST: "update_request",
  DELETE_REQUEST: "delete_request",
  CREATE_COUNTRY: "create_country",
  CREATE_CITY: "create_city",
  LOGIN: "login",
} as const;
