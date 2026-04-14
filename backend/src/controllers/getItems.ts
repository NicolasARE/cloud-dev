import { Request, Response } from "express";
import itemService from "../services/item.js";

import type { ToDoItem } from "../static/models/ToDoItem.js";

const getItems = async (
  req: Request,
  res: Response<ToDoItem[]>
): Promise<void> => {
  const items = await itemService.getItems();

  res.send(items);
};

export default getItems;