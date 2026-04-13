import { Request, Response } from "express";
import db from "../persistence/index.js";

import type { ToDoItem } from "../static/models/ToDoItem.js";

const getItems = async (
  req: Request,
  res: Response<ToDoItem[]>
): Promise<void> => {
  const items = await db.getItems();

  res.send(items);
};

export default getItems;