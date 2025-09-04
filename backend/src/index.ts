import * as dotenv from "dotenv";
import * as path from "path";

const envFile =
  process.env.NODE_ENV === "production" ? ".env.prod" : ".env.local";

dotenv.config({ path: path.resolve(__dirname, "..", envFile) });

import express from "express";
import morgan from "morgan";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import errorHandler from "./middlewares/error-handler-middleware";
import { verifyToken } from "./middlewares/auth-middleware";
import { socketAuthMiddleware } from "./middlewares/socket-auth-middleware";

import authRoutes from "./routes/auth-routes";
import enumRoutes from "./routes/enum-routes";
import personRoutes from "./routes/person-routes";
import orderRoutes from "./routes/order-routes";
import contactRoutes from "./routes/contact-routes";
import requestRoutes from "./routes/request-routes";
import locationRoutes from "./routes/location-routes";
import activityLogRoutes from "./routes/activity-logs-routes";
import uploadRoutes from "./routes/upload-routes";
import novaPoshtaRoutes from "./routes/novaposhta-routes";
import orderChatRoutes from "./routes/order-chat-routes";
import financeRoutes from "./routes/finance-routes";
import reportRoutes from "./routes/report-routes";
import dashboardRoutes from "./routes/dashboard-routes";
import chatRoutes from "./routes/chat-routes";
import badgesRoutes from "./routes/badges-routes";
import statisticRoutes from "./routes/statistic-routes";

import { telegramAdapter } from "./providers/telegram-adapter";

import { registerSocketHandlers } from "./sockets";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:8000",
      "http://localhost:3000",
      "http://test-crm.jewel-wax.com.ua",
      "https://test-crm.jewel-wax.com.ua",
      "http://crm.jewel-wax.com.ua",
      "https://crm.jewel-wax.com.ua",
    ],
    methods: ["GET", "POST"],
  },
});
io.use(socketAuthMiddleware);
app.set("io", io);

registerSocketHandlers(io);

const PORT = process.env.PORT || 8000;

app.locals.adapters = {
  telegram: telegramAdapter,
  default: telegramAdapter,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:8000",
      "http://localhost:3000",
      "http://test-crm.jewel-wax.com.ua",
      "https://test-crm.jewel-wax.com.ua",
      "http://crm.jewel-wax.com.ua",
      "https://crm.jewel-wax.com.ua",
    ],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  console.log("home page");
  res.send("CRM backend is running");
});

app.use("/auth", authRoutes);
app.use("/enums", verifyToken, enumRoutes);
app.use("/persons", personRoutes);
app.use("/orders", orderRoutes);
app.use("/contacts", contactRoutes);
app.use("/requests", requestRoutes);
app.use("/locations", locationRoutes);
app.use("/activity-logs", activityLogRoutes);
app.use("/upload", uploadRoutes);
app.use("/np", novaPoshtaRoutes);
app.use("/chats", orderChatRoutes);
app.use("/finance", financeRoutes);
app.use("/reports", reportRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/chat", chatRoutes);
app.use("/badges", badgesRoutes);
app.use("/statistic", statisticRoutes);

app.use(errorHandler);

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
