import { apiClient } from '../utils/apiClient';
import { GreetingDto } from '../models/Greeting.model';

export function getGreeting(): Promise<GreetingDto> {
    return apiClient.get<GreetingDto>('/api/greeting');
}
