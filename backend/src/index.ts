import express, { Application } from "express";
import path from "path";
import { fileURLToPath } from "url";

import db from "./persistence/index.js";
import getGreeting from "./controllers/getGreeting.js";
import getItems from "./controllers/getItems.js";
import addItem from "./controllers/addItem.js";
import updateItem from "./controllers/updateItem.js";
import deleteItem from "./controllers/deleteItem.js";
import register from "./controllers/register.js";
import login from "./controllers/login.js";
import getProfile from "./controllers/getProfile.js";
import changePassword from "./controllers/changePassword.js";
import deleteAccount from "./controllers/deleteAccount.js";
import { authenticateToken } from "./middleware/auth.js";

const app: Application = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

app.get("/api/greeting", getGreeting);

// Auth Routes
app.post("/api/auth/register", register);
app.post("/api/auth/login", login);

// Profile Routes (Protected)
app.get("/api/auth/profile", authenticateToken as any, getProfile as any);
app.put("/api/auth/password", authenticateToken as any, changePassword as any);
app.delete("/api/auth/account", authenticateToken as any, deleteAccount as any);

// Item Routes (Protected)
app.get("/api/items", authenticateToken as any, getItems as any);
app.post("/api/items", authenticateToken as any, addItem as any);
app.put("/api/items/:id", authenticateToken as any, updateItem as any);
app.delete("/api/items/:id", authenticateToken as any, deleteItem as any);

db.init()
  .then(() => {
    app.listen(3000, () => console.log("Listening on port 3000"));
  })
  .catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });

const gracefulShutdown = (): void => {
  db.teardown()
    .catch(() => {})
    .then(() => process.exit());
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
process.on("SIGUSR2", gracefulShutdown);