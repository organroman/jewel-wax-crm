import express from 'express';

import pool from './db/db';

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json())


app.get("/", (req, res) => {
    console.log('home page')
  res.send("CRM backend is running 🧠💥");
});

app.listen(PORT, async () => {
 try {
   const result = await pool.query("SELECT NOW()");
   console.log("✅ DB connected:", result.rows[0]);
 } catch (err) {
   console.error("❌ DB connection error:", err);
 }

});