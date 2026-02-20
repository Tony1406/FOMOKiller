import { useState, useEffect } from 'react';
import { getAllGames, updateStatus } from '../services/api';
import GameInfoModal from '../components/GameInfoModal';
import './SwipePage.css';

interface Genre {
    id: number;
    name: string;
}

interface Game {
    id: number;
    title: string;
    description: string;
    release_year: number;
    developer: string;
    image_url: string;
    Genres?: Genre[];
}

const USER_ID = 1; // ID de usuario fijo hasta que haya autenticación

// Array de degradados para las cartas sin imagen
const fallbackBackgrounds = [
    'linear-gradient(135deg, #1a0a00 0%, #4a1500 40%, #8B2500 100%)',
    'linear-gradient(135deg, #0a0020 0%, #2d0060 40%, #6a00cc 100%)',
    'linear-gradient(135deg, #001a00 0%, #003300 40%, #006600 100%)',
    'linear-gradient(135deg, #001f3f 0%, #0056b3 40%, #0099ff 100%)',
    'linear-gradient(135deg, #33001a 0%, #800040 40%, #cc0066 100%)'
];

export default function SwipePage() {
    const [games, setGames] = useState<Game[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        loadGames();
    }, []);

    const loadGames = async () => {
        try {
            const data = await getAllGames();
            setGames(data);
        } catch (error) {
            console.error("Error al cargar juegos:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (status: 'LIKED' | 'DISLIKED') => {
        if (currentIndex >= games.length) return;
        const currentGame = games[currentIndex];

        try {
            await updateStatus(USER_ID, currentGame.id, status);
        } catch (error) {
            console.error("Error al actualizar estado:", error);
            // Mostraríamos un toast o notificación en un caso ideal
        }

        // Avanzamos a la siguiente carta independientemente de si el backend falló,
        // (Optimistic update para la mejor UX)
        setCurrentIndex(prev => prev + 1);
    };

    if (loading) {
        return (
            <div className="swipe-page page-enter">
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: 20 }}>Cargando recomendaciones...</div>
                </div>
            </div>
        );
    }

    if (currentIndex >= games.length) {
        return (
            <div className="swipe-page page-enter">
                <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
                        <div style={{ fontSize: 50, marginBottom: 20 }}>🎉</div>
                        <div style={{ fontSize: 24, marginBottom: 10 }}>¡Te has pasado el catálogo!</div>
                        <div style={{ color: 'var(--text-secondary)' }}>Vuelve más tarde para más juegos.</div>
                    </div>
                </div>
            </div>
        );
    }

    const currentCard = games[currentIndex];
    const nextCard = games[currentIndex + 1];
    const nextNextCard = games[currentIndex + 2];

    const getBackground = (game: Game, index: number) => {
        if (game.image_url) {
            return {
                backgroundImage: `url(${game.image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                width: '100%',
                height: '100%'
            };
        }
        return {
            background: fallbackBackgrounds[index % fallbackBackgrounds.length],
            width: '100%',
            height: '100%'
        };
    };

    return (
        <div className="swipe-page page-enter">
            <GameInfoModal
                isOpen={showInfo}
                onClose={() => setShowInfo(false)}
                game={currentCard}
            />

            {/* Card Stack */}
            <div className="swipe-stack">
                {nextNextCard && (
                    <div className="swipe-card swipe-card-behind2">
                        <div style={getBackground(nextNextCard, currentIndex + 2)} />
                        <div className="swipe-card-gradient" />
                    </div>
                )}

                {nextCard && (
                    <div className="swipe-card swipe-card-behind">
                        <div style={getBackground(nextCard, currentIndex + 1)} />
                        <div className="swipe-card-gradient" />
                    </div>
                )}

                <div className="swipe-card swipe-card-front">
                    <div style={getBackground(currentCard, currentIndex)}>
                        {/* Si no hay imagen, mostrar una letra grande del título como "cover" falso */}
                        {!currentCard.image_url && (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 120, opacity: 0.5, fontWeight: 'bold' }}>
                                {currentCard.title.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                    <div className="swipe-card-gradient" />
                    <div className="swipe-card-info">
                        <div className="swipe-card-title">{currentCard.title}</div>

                        {currentCard.Genres && currentCard.Genres.length > 0 && (
                            <div className="swipe-card-tags">
                                {currentCard.Genres.slice(0, 3).map((genre) => (
                                    <span key={genre.id} className="badge badge-cobalt">{genre.name}</span>
                                ))}
                            </div>
                        )}

                        <div className="swipe-card-meta">
                            <span>{currentCard.release_year || currentCard.developer || 'Desconocido'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="swipe-actions">
                <button className="swipe-btn swipe-btn-pass" onClick={() => handleAction('DISLIKED')}>✕</button>
                <button className="swipe-btn swipe-btn-info" onClick={() => setShowInfo(true)}>ℹ️</button>
                <button className="swipe-btn swipe-btn-like" onClick={() => handleAction('LIKED')}>🔥</button>
            </div>
        </div>
    );
}
