import { Request, Response } from "express";
import db from "../persistence/index.js";
import type { ToDoItemDtoId } from "../static/models/ToDoItem.js";

const deleteItem = async (
  req: Request<ToDoItemDtoId>,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  await db.removeItem(id);

  res.sendStatus(200);
};

export default deleteItem;