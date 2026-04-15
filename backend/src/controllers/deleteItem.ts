import { Response } from "express";
import { AuthRequest } from "../middleware/auth.js";
import itemService from "../services/item.js";

const deleteItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
        res.status(401).json({ message: "Non autorisé" });
        return;
    }
    const { id } = req.params;

    await itemService.deleteItem(id as string, req.user.id);

    res.sendStatus(204);
  } catch (error) {
    res.status(404).send((error as Error).message);
  }
};

export default deleteItem;