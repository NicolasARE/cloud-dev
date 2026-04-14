import { Request, Response } from "express";
import itemService from "../services/item.js";

import type { ToDoItem, ToDoItemDtoId, ToDoItemDtoUpdate } from "../static/models/ToDoItem.js";

const updateItem = async (
  req: Request<ToDoItemDtoId, {}, ToDoItemDtoUpdate>,
  res: Response<ToDoItem | string>
): Promise<void> => {
  const { id } = req.params;
  const itemUpdate = req.body;

  const item = await itemService.updateItem(id, itemUpdate);

  res.send(item);
};

export default updateItem;