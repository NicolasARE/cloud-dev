export interface ToDoItem {
  id: string;
  name: string;
  completed: boolean;
}

export type ToDoItemDtoId = {
  id: string;
};

export type ToDoItemDtoAdd = {
  name?: string;
};

export type ToDoItemDtoUpdate = {
  name?: string;
  completed?: boolean;
};