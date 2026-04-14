
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

    if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
    }

    // DELETE peut ne rien retourner
    if (res.status === 204) {
        return undefined as T;
    }

    return res.json();
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