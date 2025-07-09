import bcryptjs from "bcryptjs";
import db from "db/db";

async function insertAdmin() {
  const passwordHash = await bcryptjs.hash("admin123", 10); // replace with secure pass

  await db("persons")
    .insert({
      first_name: "Admin",
      last_name: "User",
      email: "admin@example.com",
      role: "super_admin",
      password_hash: passwordHash,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .onConflict("email")
    .ignore();

  console.log("✅ Super admin inserted (if not already exists)");
  process.exit();
}

insertAdmin().catch((e) => {
  console.error("❌ Failed to insert admin:", e);
  process.exit(1);
});
