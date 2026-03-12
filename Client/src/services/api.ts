const URL = 'http://localhost:3000/api';

// Función helper para obtener el token del localStorage y armar la cabecera
const getAuthHeaders = (): Record<string, string> => {
    const token = localStorage.getItem('fomokiller_token');
    return token ? { "Authorization": `Bearer ${token}` } : {};
};

export const getCollections = async () => {
    const response = await fetch(`${URL}/explore/collections`, { headers: getAuthHeaders() });
    const data = await response.json();
    return data;
};

export const getCollectionGames = async (collectionId: number) => {
    const response = await fetch(`${URL}/explore/collections/${collectionId}`, { headers: getAuthHeaders() });
    const data = await response.json();
    return data;
};

export const searchGames = async (query: string) => {
    const response = await fetch(`${URL}/explore/search?q=${encodeURIComponent(query)}`, { headers: getAuthHeaders() });
    const data = await response.json();
    return data;
};

export const getAllGames = async () => {
    const response = await fetch(`${URL}/home/all`, { headers: getAuthHeaders() });
    const data = await response.json();
    console.log(data);
    return data;
};

export const getBacklog = async (userId: number) => {
    const response = await fetch(`${URL}/my-games/backlog?userId=${userId}`, { headers: getAuthHeaders() });
    const data = await response.json();
    return data;
};

export const updateStatus = async (userId: number, gameId: number, status: string) => {
    const response = await fetch(`${URL}/my-games/status?userId=${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders() // Agregamos el token aquí
        },
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
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders() // Agregamos el token aquí
        },
        body: JSON.stringify({
            gameId: gameId,
            isFinished: isFinished
        }),
    });

    return response.json();
};

export const getUserProfile = async (userId: number) => {
    const response = await fetch(`${URL}/users/profile/${userId}`, { headers: getAuthHeaders() });
    if (!response.ok) {
        throw new Error(`Error fetching user profile: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};

export const updateUserProfile = async (userId: number, profileData: any) => {
    const response = await fetch(`${URL}/users/profile/${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            ...getAuthHeaders() // Agregamos el token aquí
        },
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        throw new Error(`Error updating user profile: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};

export const login = async (email: string, password: string) => {
    const response = await fetch(`${URL}/users/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            password: password
        }),
    });

    return response.json();
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