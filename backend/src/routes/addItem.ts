import { Request, Response } from "express";
import db from "../persistence/index.js";
import { v4 as uuid } from "uuid";

import type { ToDoItem, ToDoItemDtoAdd } from "../static/models/ToDoItem.js";

const addItem = async (
  req: Request<{}, {}, ToDoItemDtoAdd>,
  res: Response<ToDoItem | string>
): Promise<void> => {
  const { name } = req.body;

  if (!name || !name.trim()) {
    res.status(400).send("Le nom est requis");
    return;
  }

  const item: ToDoItem = {
    id: uuid(),
    name: name.trim(),
    completed: false,
  };

  await db.storeItem(item);

  res.send(item);
};

export default addItem;