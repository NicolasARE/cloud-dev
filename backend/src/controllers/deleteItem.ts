import { Request, Response } from "express";
import itemService from "../services/item.js";
import type { ToDoItemDtoId } from "../static/models/ToDoItem.js";

const deleteItem = async (
  req: Request<ToDoItemDtoId>,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  await itemService.deleteItem(id);

  res.sendStatus(204);
};

export default deleteItem;