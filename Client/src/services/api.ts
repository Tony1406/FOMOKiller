const URL = 'http://localhost:3000/api';
export const USER_ID = 7;

export const getCollections = async () => {
    const response = await fetch(`${URL}/explore/collections`);
    const data = await response.json();
    return data;
};

export const getCollectionGames = async (collectionId: number) => {
    const response = await fetch(`${URL}/explore/collections/${collectionId}`);
    const data = await response.json();
    return data;
};

export const searchGames = async (query: string) => {
    const response = await fetch(`${URL}/explore/search?q=${encodeURIComponent(query)}`);
    const data = await response.json();
    return data;
};

export const getAllGames = async () => {
    const response = await fetch(`${URL}/home/all`);
    const data = await response.json();
    console.log(data);
    return data;
};

export const getBacklog = async (userId: number) => {
    const response = await fetch(`${URL}/my-games/backlog?userId=${userId}`);
    const data = await response.json();
    return data;
};

export const updateStatus = async (userId: number, gameId: number, status: string) => {
    const response = await fetch(`${URL}/my-games/status?userId=${userId}`, {
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

export const markFinished = async (userId: number, gameId: number, isFinished: boolean) => {
    const response = await fetch(`${URL}/my-games/finish?userId=${userId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            gameId: gameId,
            isFinished: isFinished
        }),
    });

    return response.json();
};

export const getUserProfile = async (userId: number) => {
    const response = await fetch(`${URL}/users/profile/${userId}`);
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
        },
        body: JSON.stringify(profileData),
    });

    if (!response.ok) {
        throw new Error(`Error updating user profile: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
};