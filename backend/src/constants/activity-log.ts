export const LOG_TARGETS = {
  PERSON: "person",
  ORDER: "order",
  CONTACT: "contact",
  REQUEST: "request",
  COUNTRY: "country",
  CITY: "city",
} as const;

export const LOG_ACTIONS = {
  CREATE_PERSON: "create_person",
  UPDATE_PERSON: "update_person",
  DELETE_PERSON: "delete_person",
  CREATE_ORDER: "create_order",
  UPDATE_ORDER: "update_order",
  DELETE_ORDER: "delete_order",
  DELETE_ORDER_CHAT: "delete_order_chat",
  CREATE_INVOICE: "create_invoice",
  CREATE_EXPENSE: "create_expense",
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
