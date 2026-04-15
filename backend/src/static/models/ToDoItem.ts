export interface ToDoItem {
    id: string;
    name: string;
    completed: boolean;
    userId: string;
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
