import { createContext } from 'react';

export type Notification = {
    message: string;
    type: 'success' | 'error';
};

export interface NotificationContextType {
    notify: (n: Notification) => void;
}

export const NotificationContext =
    createContext<NotificationContextType | null>(null);
