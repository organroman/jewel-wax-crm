export const LOG_TARGETS = {
  PERSON: "person",
  CONTACT: "contact"
} as const;

export const LOG_ACTIONS = {
  CREATE_PERSON: "create_person",
  UPDATE_PERSON: "update_person",
  DELETE_PERSON: "delete_person",
  CREATE_CONTACT: "create_contact",
  UPDATE_CONTACT: "update_contact",
  DELETE_CONTACT: "delete_contact",
  LOGIN: "login",
} as const;
