import { Request, Response } from "express";
import itemService from "../services/item.js";
import type { ToDoItemDtoId } from "../static/models/ToDoItem.js";

const deleteItem = async (
  req: Request<ToDoItemDtoId>,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    await itemService.deleteItem(id);

    res.sendStatus(204);
  } catch (error) {
    res.status(404).send((error as Error).message);
  }
};

export default deleteItem;