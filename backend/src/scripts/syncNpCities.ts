import { NovaPoshtaModel } from "../models/novaposhta-model";
import db from "../db/db";

const syncNpCities = async () => {
  const UKRAINE_COUNTRY_NAME = "Україна";
  const ukraine = await db("countries")
    .where("name", UKRAINE_COUNTRY_NAME)
    .first();
  if (!ukraine) throw new Error("❌ Country 'Ukraine' not found in DB");

  const { success, data, errors } = await NovaPoshtaModel.getCities("");
  if (!success) {
    console.error("Nova Poshta error:", errors);
    return;
  }

  for (const npCity of data) {
    const existing = await db("cities")
      .where({ name: npCity.Description, country_id: ukraine.id })
      .first();

    const cityData = {
      name: npCity.Description,
      ref: npCity.Ref,
      area: npCity.AreaDescription,
      area_ref: npCity.Area,
      settlement_type: npCity.SettlementTypeDescription,
      settlement_type_ref: npCity.SettlementType,
      country_id: ukraine.id,
    };

    if (existing) {
      await db("cities").where("id", existing.id).update(cityData);
    } else {
      await db("cities").insert(cityData);
    }
  }

  console.log(`✅ Synced ${data.length} Nova Poshta cities`);
};

syncNpCities();
