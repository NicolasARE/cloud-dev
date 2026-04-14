import { render } from '@testing-library/react';
import { NotificationProvider } from '@/application/contexts/NotificationContext';

export function renderWithProviders(ui: React.ReactElement) {
    return render(
        <NotificationProvider>
            {ui}
        </NotificationProvider>
    );
}