import express from "express";

import db from "./db/db";

import userRoutes from "./routes/user-routes";
import errorHandler from "./middlewares/error-handler-middleware";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
  console.log("home page");
  res.send("CRM backend is running");
});

app.use("/users", userRoutes);

app.use(errorHandler);

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)
});
