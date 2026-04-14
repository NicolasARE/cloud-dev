export interface TodoItem {
    id: string;
    name: string;
    completed: boolean;
}

export interface CreateItemDto {
    name: string;
}

export type UpdateItemDto = Partial<Omit<TodoItem, 'id'>>;

export type TodoItemDto = TodoItem;