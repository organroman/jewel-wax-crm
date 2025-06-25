import db from "../db/db";
import { NovaPoshtaModel } from "../models/novaposhta-model";

import AppError from "./AppError";
import ERROR_MESSAGES from "../constants/error-messages";

export async function ensureRecipientExists(
  address: {
    np_recipient_ref: string;
    np_contact_recipient_ref: string;
    delivery_address_id: string;
  },
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
  }
): Promise<{
  recipientRef: string;
  contactRef: string;
}> {
  if (address.np_recipient_ref && address.np_contact_recipient_ref) {
    return {
      recipientRef: address.np_recipient_ref,
      contactRef: address.np_contact_recipient_ref,
    };
  }

  const { data, success, errors } = await NovaPoshtaModel.createCounterParty({
    FirstName: customer.firstName,
    LastName: customer.lastName,
    Phone: customer.phone,
  });

  if (!success || !data?.[0]) {
    throw new AppError(
      errors?.[0] || ERROR_MESSAGES.FAILED_TO_CREATE_NP_RECIPIENT,
      500
    );
  }

  const newRecipient = data?.[0];

  await db("delivery_addresses")
    .where({ id: address.delivery_address_id })
    .update({
      np_recipient_ref: newRecipient.Ref,
      np_contact_recipient_ref: newRecipient.ContactPerson.data?.[0].Ref,
    });

  return {
    recipientRef: newRecipient.Ref,
    contactRef: newRecipient.ContactPerson?.data?.[0].Ref,
  };
}
