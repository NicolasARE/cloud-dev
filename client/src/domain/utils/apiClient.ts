
async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const token = localStorage.getItem('token');
    // Si VITE_API_URL est vide ou relatif, on s'assure que le chemin commence par /api
    const baseUrl = import.meta.env.VITE_API_URL || '';
    const fullPath = (baseUrl === '' && !path.startsWith('/api')) ? `/api${path}` : path;
    
    const res = await fetch(`${baseUrl}${fullPath}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
        ...options,
    });

    const text = await res.text();
    let data: unknown = null;

    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }

    if (!res.ok) {
        throw new Error(
            typeof data === 'string'
                ? data
                : (data as { message?: string })?.message || 'Erreur serveur',
        );
    }

    return data as T;
}

export const apiClient = {
    get: <T>(path: string) => request<T>(path, { method: 'GET' }),

    post: <T, B = unknown>(path: string, body: B) =>
        request<T>(path, {
            method: 'POST',
            body: JSON.stringify(body),
        }),

    put: <T, B = unknown>(path: string, body: B) =>
        request<T>(path, {
            method: 'PUT',
            body: JSON.stringify(body),
        }),

    delete: <T = void>(path: string) =>
        request<T>(path, {
            method: 'DELETE',
        }),
};