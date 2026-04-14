
async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const res = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        ...options,
    });

    const text = await res.text();
    let data: any = null;

    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }

    if (!res.ok) {
        throw new Error(
            typeof data === 'string'
                ? data
                : data?.message || 'Erreur serveur',
        )
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