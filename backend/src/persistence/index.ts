import mysql from "./mysql.js";
import sqlite from "./sqlite.js";
import type { Database } from "../static/models/Database.js";

const db: Database = process.env.MYSQL_HOST ? mysql : sqlite;

export default db;