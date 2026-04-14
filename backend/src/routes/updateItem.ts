import { Request, Response } from "express";
import db from "../persistence/index.js";

import type { ToDoItem, ToDoItemDtoId, ToDoItemDtoUpdate } from "../static/models/ToDoItem.js";

const updateItem = async (
  req: Request<ToDoItemDtoId, {}, ToDoItemDtoUpdate>,
  res: Response<ToDoItem | string>
): Promise<void> => {
  const { id } = req.params;
  const { name, completed } = req.body;

  if (!name || !name.trim()) {
    res.status(400).send("Le nom est requis");
    return;
  }

  await db.updateItem(id, {
    id,
    name: name.trim(),
    completed: !!completed,
  });

  const item = await db.getItem(id);

  res.send(item);
};

export default updateItem;