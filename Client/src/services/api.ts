const URL = 'http://localhost:3000/api';

// Función helper para obtener el token del localStorage y armar la cabecera

export const getCollections = async () => {
    const response = await fetch(`${URL}/explore/collections`, { credentials: 'include' });
    const data = await response.json();
    return data;
};

export const getCollectionGames = async (collectionId: number) => {
    const response = await fetch(`${URL}/explore/collections/${collectionId}`, { credentials: 'include' });
    const data = await response.json();
    return data;
};

export const searchGames = async (query: string) => {
    const response = await fetch(`${URL}/explore/search?q=${encodeURIComponent(query)}`, { credentials: 'include' });
    const data = await response.json();
    return data;
};

export const getAllGames = async () => {
    const response = await fetch(`${URL}/home/all`, { credentials: 'include' });
    const data = await response.json();
    console.log(data);
    return data;
};

export const getBacklog = async (userId: number) => {
    const response = await fetch(`${URL}/my-games/backlog?userId=${userId}`, { credentials: 'include' });
    const data = await response.json();
    return data;
};

export const updateStatus = async (userId: number, gameId: number, status: string) => {
    const response = await fetch(`${URL}/my-games/status?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
            gameId: gameId,
            status: status
        }),
    });

    return response.json();
};

export const markFinished = async (userId: number, gameId: number, isFinished: boolean) => {
    const response = await fetch(`${URL}/my-games/finish?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
            gameId: gameId,
            isFinished: isFinished
        }),
    });

    return response.json();
};

export const getUserProfile = async (userId: number) => {
    const response = await fetch(`${URL}/users/profile/${userId}`, { credentials: 'include' });
    if (!response.ok) {
        throw new Error(`Error fetching user profile: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};

export const updateUserProfile = async (userId: number, profileData: any) => {
    const response = await fetch(`${URL}/users/profile/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        throw new Error(`Error updating user profile: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};

export const login = async (email: string, password: string) => {
    const res = await fetch(`${URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
    });
    return res.json();
};

export const register = async (username: string, email: string, password: string) => {
    const response = await fetch(`${URL}/users/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password
        }),
    });

    return response.json();
};

export const setPriority = async (userId: number, gameId: number, isPriority: boolean) => {
    const response = await fetch(`${URL}/my-games/priority?userId=${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify({
            gameId: gameId,
            isPriority: isPriority
        }),
    });

    return response;
};

export const clearBacklog = async (userId: number) => {
    const response = await fetch(`${URL}/my-games/clear?userId=${userId}`, {
        method: "DELETE",
        credentials: 'include',
    });
    return response;
};

export const getPriorities = async (userId: number) => {
    const response = await fetch(`${URL}/my-games/priorities?userId=${userId}`, { credentials: 'include' });
    const data = await response.json();
    return data;
};

export const getGameDetails = async (slug: string) => {
    const response = await fetch(`${URL}/rawg/${slug}`, { credentials: 'include' });
    const data = await response.json();
    return data;
};

export const reorderPriorities = async (userId: number, order: { gameId: number; priorityOrder: number }[]) => {
    const response = await fetch(`${URL}/my-games/priorities/reorder?userId=${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ order }),
    });
    return response;
};