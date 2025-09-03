import db from "../../db/db";
import { DeliveryAddress } from "../../types/person.types";

export const PersonDeliveryAddressModel = {
  async getDeliveryAddressesByPersonId(
    personId: number
  ): Promise<DeliveryAddress[]> {
    return await db<DeliveryAddress>("delivery_addresses")
      .where("person_id", personId)
      .leftJoin("cities", "delivery_addresses.city_id", "cities.id")
      .select(
        "delivery_addresses.id",
        "delivery_addresses.person_id",
        "delivery_addresses.type",
        "delivery_addresses.np_warehouse_ref",
        "delivery_addresses.np_warehouse",
        "delivery_addresses.np_warehouse_siteKey",
        "delivery_addresses.street",
        "delivery_addresses.street_ref",
        "delivery_addresses.house_number",
        "delivery_addresses.flat_number",
        "delivery_addresses.np_recipient_ref",
        "delivery_addresses.np_contact_recipient_ref",
        "delivery_addresses.is_main",
        "delivery_addresses.city_id",
        "cities.name as city_name",
        "cities.ref as city_ref",
        "cities.region",
        "cities.area"
      );
  },

  async createDeliveryAddresses(
    personId: number,
    deliveryAddress: DeliveryAddress[]
  ) {
    await db("delivery_addresses").insert(
      deliveryAddress.map((deliveryAddress) => ({
        ...deliveryAddress,
        person_id: personId,
      }))
    );
  },

  async deleteDeliveryAddresses(deliveryAddressIds: number[]) {
    await Promise.all(
      deliveryAddressIds.map((id) => {
        return db<DeliveryAddress>("delivery_addresses")
          .where("id", id)
          .update({
            person_id: null,
          });
      })
    );
  },

  async updateDeliveryAddresses(
    toUpdate: DeliveryAddress[],
    updatedDeliveryAddress: DeliveryAddress[]
  ) {
    await Promise.all(
      toUpdate.map((p) => {
        const updated = updatedDeliveryAddress.find((u) => u.id === p.id);
        if (!updated) return;
        return db<DeliveryAddress>("delivery_addresses")
          .where("id", p.id)
          .update({
            ...updated,
            updated_at: new Date(),
          });
      })
    );
  },
};
