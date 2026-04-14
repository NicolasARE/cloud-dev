import type { CreateItemDto, TodoItemDto } from '../models/Item.model';
import { apiClient } from '../utils/apiClient';

export function addItem(dto: CreateItemDto): Promise<TodoItemDto> {
    return apiClient.post<TodoItemDto, CreateItemDto>('/items', dto);
}