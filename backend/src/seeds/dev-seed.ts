import db from "../db/db";
import bcrypt from "bcryptjs";

async function seed() {
  console.log("🌱 Seeding development data...");

  await db("phones").del();
  await db("delivery_addresses").del();
  await db("persons").del();

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const persons = await db("persons")
    .insert([
      {
        first_name: "Roman",
        last_name: "Stolbov",
        email: "super@crm.com",
        password: hashedPassword,
        role: "super_admin",
        is_active: true,
      },
      {
        first_name: "Alina",
        last_name: "Millerova",
        email: "admin@crm.com",
        password: hashedPassword,
        role: "admin",
        is_active: true,
      },
      {
        first_name: "Petro",
        last_name: "Modeller",
        email: "modeller@crm.com",
        password: hashedPassword,
        role: "modeller",
        is_active: true,
      },
      {
        first_name: "Larysa",
        last_name: "Customer",
        email: "client@crm.com",
        role: "client",
        is_active: true,
        city: "Kyiv",
      },

      {
        first_name: "John",
        last_name: "Customer",
        email: "clientjhon@crm.com",
        role: "client",
        is_active: true,
        city: "Kyiv",
      },
    ])
    .returning("*");

  for (const person of persons) {
    await db("phones").insert({
      person_id: person.id,
      number: `+38067${Math.floor(1000000 + Math.random() * 9000000)}`,
      is_main: true,
    });

    if (person.role === "client") {
      await db("delivery_addresses").insert([
        {
          person_id: person.id,
          address_line: "Nova Poshta №5, Kyiv",
        },
        {
          person_id: person.id,
          address_line: "Nova Poshta №12, Kyiv",
        },
      ]);
    }
  }

  console.log("✅ Seed completed.");
  process.exit();
}

seed();
