const BASE_URL = 'http://localhost:3000/api';

export const getCollections = async () => {
    const response = await fetch(`${BASE_URL}/explore/collections`);
    const data = await response.json();
    return data;
};

export const getCollectionGames = async (collectionId: number) => {
    const response = await fetch(`${BASE_URL}/explore/collections/${collectionId}`);
    const data = await response.json();
    return data;
};

export const searchGames = async (query: string) => {
    const response = await fetch(`${BASE_URL}/explore/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
};

export const getGameDetails = async (gameId: number) => {
    const response = await fetch(`${BASE_URL}/home/details/${gameId}`);
    const data = await response.json();
    return data;
};

export const getAllGames = async () => {
    const response = await fetch(`${BASE_URL}/home/all`);
    const data = await response.json();
    console.log(data);
    return data;
};

export const getBacklog = async (userId: number) => {
    const response = await fetch(`${BASE_URL}/my-games/backlog?userId=${userId}`);
    const data = await response.json();
    return data;
};

export const getPriorities = async (userId: number) => {
    const response = await fetch(`${BASE_URL}/my-games/priorities?userId=${userId}`);
    const data = await response.json();
    return data;
};

export const updateStatus = async (userId: number, gameId: number, status: string) => {
    const response = await fetch(`${BASE_URL}/my-games/status?userId=${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            gameId: gameId,
            status: status
        }),
    });

    return response.json();
};
