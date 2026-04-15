export interface TodoItem {
    id: string;
    name: string;
    completed: boolean;
}

export interface AddItemDto {
    name: string;
}

export type UpdateItemDto = Partial<Omit<TodoItem, 'id'>>;

export type TodoItemDto = TodoItem;
