import express, { Application } from "express";
import path from "path";
import { fileURLToPath } from "url";

import db from "./persistence/index.js";
import getGreeting from "./routes/getGreeting.js";
import getItems from "./routes/getItems.js";
import addItem from "./routes/addItem.js";
import updateItem from "./routes/updateItem.js";
import deleteItem from "./routes/deleteItem.js";

const app: Application = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

app.get("/api/greeting", getGreeting);
app.get("/api/items", getItems);
app.post("/api/items", addItem);
app.put("/api/items/:id", updateItem);
app.delete("/api/items/:id", deleteItem);

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