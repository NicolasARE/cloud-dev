import { createContext, useContext, useState, ReactNode, useRef } from 'react';
import Alert from 'react-bootstrap/Alert';

import '../assets/notification.scss';

type Notification = {
    message: string;
    type: 'success' | 'error';
};

interface NotificationContextType {
    notify: (n: Notification) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notification, setNotification] = useState<Notification | null>(null);

    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const notify = (n: Notification) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setNotification(n);

        timeoutRef.current = setTimeout(() => {
            setNotification(null);
        }, 3000);
    };

    const handleClose = () => {
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ notify }}>
            {notification && (
                <Alert
                    variant={notification.type === 'success' ? 'success' : 'danger'}
                    onClose={handleClose}
                    dismissible
                    className="notification"
                >
                    {notification.message}
                </Alert>
            )}

            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const ctx = useContext(NotificationContext);
    if (!ctx) {
        throw new Error('useNotification doit être utiliser dans NotificationProvider');
    }
    return ctx;
}