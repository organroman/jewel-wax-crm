import express from "express";
import morgan from "morgan";

import errorHandler from "./middlewares/error-handler-middleware";

import personRoutes from "./routes/person-routes";
import contactRoutes from "./routes/contact-routes";
import enumRoutes from "./routes/enum-routes";
import authRoutes from "./routes/auth-rotes";
import { verifyToken } from "./middlewares/auth-middleware";

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/", (req, res) => {
  console.log("home page");
  res.send("CRM backend is running");
});

app.use("/auth", authRoutes);
app.use("/enums", verifyToken, enumRoutes);
app.use("/persons", personRoutes);
app.use("/contacts", contactRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});
