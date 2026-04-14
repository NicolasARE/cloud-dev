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

async function updateItem(id: string, input: ToDoItemDtoUpdate): Promise<ToDoItem | undefined> {
  const name = input.name?.trim();
  if (!name) throw new Error("Le nom est requis");

  const item: ToDoItem = {
    id,
    name: name,
    completed: !!input.completed,
  };

  await todoRepository.updateItem(id, item);
  return todoRepository.getItem(id);
}

async function deleteItem(id: string): Promise<void> {
  await todoRepository.removeItem(id);
}

export default {
  getItems,
  addItem,
  updateItem,
  deleteItem,
};