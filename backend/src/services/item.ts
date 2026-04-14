import todoRepository from "../repositories/item.js";
import type { ToDoItem, ToDoItemDtoAdd, ToDoItemDtoUpdate } from "../static/models/ToDoItem.js";
import { v4 as uuid } from "uuid";

async function getItems(): Promise<ToDoItem[]> {
  return todoRepository.getItems();
}

async function addItem(input: ToDoItemDtoAdd): Promise<ToDoItem> {
  const name = input.name?.trim();
  if (!name) throw new Error("Le nom est requis");

  const item: ToDoItem = {
    id: uuid(),
    name,
    completed: false,
  };

  await todoRepository.addItem(item);
  return item;
}

async function updateItem(
  id: string,
  input: ToDoItemDtoUpdate
): Promise<ToDoItem> {
  const existing = await todoRepository.getItem(id);

  if (!existing) {
    throw new Error("Item introuvable");
  }

  const name = input.name?.trim();
  if (!name) throw new Error("Le nom est requis");

  const updatedItem: ToDoItem = {
    id,
    name,
    completed: !!input.completed,
  };

  await todoRepository.updateItem(id, updatedItem);

  return updatedItem;
}

async function deleteItem(id: string): Promise<void> {
  const existing = await todoRepository.getItem(id);

  if (!existing) {
    throw new Error("Item introuvable");
  }

  await todoRepository.removeItem(id);
}

export default {
  getItems,
  addItem,
  updateItem,
  deleteItem,
};