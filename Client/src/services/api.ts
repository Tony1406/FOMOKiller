const URL = 'http://localhost:3000/api';

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

export const getMe = async () => {
    const res = await fetch(`${URL}/users/me`, { credentials: 'include' });
    if (!res.ok) return null;
    return res.json();
};

export const logoutUser = async () => {
    await fetch(`${URL}/users/logout`, { method: 'POST', credentials: 'include' });
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

export const uploadImage = async (file: File): Promise<string | null> => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch(`${URL}/upload`, { method: 'POST', credentials: 'include', body: formData });
    if (!res.ok) return null;
    const data = await res.json();
    return data.url ?? null;
};

export const getGameDetails = async (slug: string) => {
    const response = await fetch(`${URL}/rawg/${slug}`, { credentials: 'include' });
    const data = await response.json();
    return data;
};

export const getGameTrailer = async (slug: string): Promise<string | null> => {
    const response = await fetch(`${URL}/rawg/${slug}/trailer`, { credentials: 'include' });
    if (!response.ok) return null;
    const data = await response.json();
    return data.trailerUrl ?? null;
};

export const getGameplayVideo = async (slug: string): Promise<string | null> => {
    const response = await fetch(`${URL}/rawg/${slug}/gameplay`, { credentials: 'include' });
    if (!response.ok) return null;
    const data = await response.json();
    return data.gameplayUrl ?? null;
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

export const savePreferences = async (userId: number, payload: object) => {
    const res = await fetch(`${URL}/recommendations/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId, ...payload }),
    });
    return res.json();
};

export const getPreferences = async (userId: number) => {
    const res = await fetch(`${URL}/recommendations/preferences/${userId}`, { credentials: 'include' });
    return res.json();
};

export const getRecommendations = async (userId: number, explore = false) => {
    const url = explore ? `${URL}/recommendations/${userId}?explore=true` : `${URL}/recommendations/${userId}`;
    const res = await fetch(url, { credentials: 'include' });
    return res.json();
};

export const toggleExploration = async (userId: number) => {
    const res = await fetch(`${URL}/recommendations/preferences/${userId}/toggle-exploration`, {
        method: 'PATCH',
        credentials: 'include',
    });
    return res.json();
};

export const resetRecommendationHistory = async (userId: number) => {
    const res = await fetch(`${URL}/recommendations/preferences/${userId}/reset-history`, {
        method: 'PATCH',
        credentials: 'include',
    });
    return res.json();
};

export const adminGetUsers = async () => {
    const res = await fetch(`${URL}/admin/users`, { credentials: 'include' });
    return res.json();
};

export const adminCreateUser = async (payload: object) => {
    const res = await fetch(`${URL}/admin/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al crear usuario');
    return data;
};

export const adminUpdateUser = async (userId: number, payload: object) => {
    const res = await fetch(`${URL}/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al actualizar usuario');
    return data;
};

export const adminUpdateRole = async (userId: number, role: string) => {
    const res = await fetch(`${URL}/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ role }),
    });
    return res.json();
};

export const adminDeleteUser = async (userId: number) => {
    const res = await fetch(`${URL}/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return res.json();
};

export const adminGetGames = async () => {
    const res = await fetch(`${URL}/admin/games`, { credentials: 'include' });
    return res.json();
};

export const adminGetPlatforms = async () => {
    const res = await fetch(`${URL}/admin/platforms`, { credentials: 'include' });
    return res.json();
};

export const adminCreateGame = async (payload: object) => {
    const res = await fetch(`${URL}/admin/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return res.json();
};

export const adminUpdateGame = async (gameId: number, payload: object) => {
    const res = await fetch(`${URL}/admin/games/${gameId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return res.json();
};

export const adminDeleteGame = async (gameId: number) => {
    const res = await fetch(`${URL}/admin/games/${gameId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return res.json();
};

export const adminSearchRawg = async (q: string, page = 1) => {
    const res = await fetch(`${URL}/admin/rawg/search?q=${encodeURIComponent(q)}&page=${page}`, { credentials: 'include' });
    return res.json();
};

export const adminImportFromRawg = async (rawgSlug: string) => {
    const res = await fetch(`${URL}/admin/rawg/import`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rawgSlug }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error al importar');
    return data;
};

export const adminGetCollections = async () => {
    const res = await fetch(`${URL}/admin/collections`, { credentials: 'include' });
    return res.json();
};

export const adminCreateCollection = async (payload: object) => {
    const res = await fetch(`${URL}/admin/collections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return res.json();
};

export const adminUpdateCollection = async (id: number, payload: object) => {
    const res = await fetch(`${URL}/admin/collections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
    });
    return res.json();
};

export const adminDeleteCollection = async (id: number) => {
    const res = await fetch(`${URL}/admin/collections/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return res.json();
};

export const adminGetCollectionGames = async (collectionId: number) => {
    const res = await fetch(`${URL}/admin/collections/${collectionId}/games`, { credentials: 'include' });
    return res.json();
};

export const adminAddGameToCollection = async (collectionId: number, gameId: number) => {
    const res = await fetch(`${URL}/admin/collections/${collectionId}/games`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ gameId }),
    });
    return res.json();
};

export const adminRemoveGameFromCollection = async (collectionId: number, gameId: number) => {
    const res = await fetch(`${URL}/admin/collections/${collectionId}/games/${gameId}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    return res.json();
};