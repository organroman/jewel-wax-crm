const VALIDATION_MESSAGES = {
  FULL_NAME: "Full name is required",
  PASSWORD: "Password should be at least 6 characters",
  EMAIL: "Invalid email",
  FIELD_REQUIRED: "At least one field must be provided",
  MIN_ONE_PHONE: "At least one phone number is required",
  MIN_ONE_MAIN_PHONE: "At least one phone must be marked as main",
  CITY: "City is required",
  ADDRESS: "Address is required",
  WAREHOUSE_REQUIRED: "Warehouse is required",
  STREET_REQUIRED: "Street is required",
  HOUSE_REQUIRED: "House is required",
} as const;

export default VALIDATION_MESSAGES;
