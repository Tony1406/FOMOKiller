import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { getAllGames, updateStatus } from '../services/api';

interface Genre {
    id: number;
    name: string;
}

interface Game {
    id: number;
    title: string;
    description: string;
    releaseYear: number;
    developer: string;
    imageUrl: string;
    Genres?: Genre[];
}

interface SwipeContextType {
    games: Game[];
    currentIndex: number;
    loading: boolean;
    handleAction: (status: 'LIKED' | 'DISLIKED') => Promise<void>;
}

const SwipeContext = createContext<SwipeContextType | undefined>(undefined);

export function SwipeProvider({ children }: { children: ReactNode }) {
    const [games, setGames] = useState<Game[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const USER_ID = 1;

    useEffect(() => {
        const loadGames = async () => {
            try {
                const data = await getAllGames();
                const shuffledGames = [...data].sort(() => Math.random() - 0.5);
                setGames(shuffledGames);
            } catch (error) {
                console.error("Error al cargar juegos:", error);
            } finally {
                setLoading(false);
            }
        };

        loadGames();
    }, []);

    const handleAction = async (status: 'LIKED' | 'DISLIKED') => {
        if (currentIndex >= games.length) return;
        const currentGame = games[currentIndex];

        try {
            await updateStatus(USER_ID, currentGame.id, status);
        } catch (error) {
            console.error("Error al actualizar estado:", error);
        }
        setCurrentIndex(prev => prev + 1);
    };

    return (
        <SwipeContext.Provider value={{ games, currentIndex, loading, handleAction }}>
            {children}
        </SwipeContext.Provider>
    );
}

export function useSwipe() {
    const context = useContext(SwipeContext);
    if (context === undefined) {
        throw new Error('useSwipe must be used within a SwipeProvider');
    }
    return context;
}
