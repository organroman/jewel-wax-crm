import bcryptjs from "bcryptjs";
import db from "../db/db";

async function insertAdmin() {
  const email = "admin@example.com";

  const existing = await db("person_emails").where("email", email).first();
  if (existing) {
    console.log("ℹ️ Admin already exists — skipping insert");
    process.exit(0);
  }

  const passwordHash = await bcryptjs.hash("admin123", 10); 

  const [person] = await db("persons")
    .insert({
      first_name: "Admin",
      last_name: "User",
      role: "super_admin",
      password: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning("id");

  const personId = person.id;

  await db("person_emails").insert({
    person_id: +personId,
    email,
    is_main: true,
    created_at: new Date(),
    updated_at: new Date(),
  });

  console.log("✅ Super admin inserted");
  process.exit(0);
}

insertAdmin().catch((e) => {
  console.error("❌ Failed to insert admin:", e);
  process.exit(1);
});

insertAdmin();
