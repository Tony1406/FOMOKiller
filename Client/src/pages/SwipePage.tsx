import { useState } from 'react';
import GameInfoModal from '../components/GameInfoModal';
import { useSwipe } from '../context/SwipeContext';
import './SwipePage.css';

export default function SwipePage() {
    const { games, currentIndex, loading, handleAction } = useSwipe();
    const [showInfo, setShowInfo] = useState(false);

    if (loading) {
        return (
            <div className="swipe-page page-enter">
                <div className="swipe-loading-container">
                    <div className="swipe-loading-text">Cargando recomendaciones...</div>
                </div>
            </div>
        );
    }

    if (currentIndex >= games.length) {
        return (
            <div className="swipe-page page-enter">
                <div className="swipe-empty-container">
                    <div className="swipe-empty-content">
                        <div className="swipe-empty-title">¡Te has pasado el catálogo!</div>
                        <div className="swipe-empty-subtitle">Vuelve más tarde para más juegos.</div>
                    </div>
                </div>
            </div>
        );
    }

    const currentCard = games[currentIndex];
    const nextCard = games[currentIndex + 1];
    const nextNextCard = games[currentIndex + 2];



    return (
        <div className="swipe-page page-enter">
            <GameInfoModal
                isOpen={showInfo}
                onClose={() => setShowInfo(false)}
                game={currentCard}
            />

            <div className="swipe-stack">
                {nextNextCard && (
                    <div className="swipe-card swipe-card-behind2">
                        <div className={`swipe-card-bg ${!nextNextCard.imageUrl ? `fallback-bg-${(currentIndex + 2) % 5}` : ''}`}>
                            {nextNextCard.imageUrl && <img src={nextNextCard.imageUrl} alt={nextNextCard.title} className="swipe-card-image" />}
                        </div>
                        <div className="swipe-card-gradient" />
                    </div>
                )}

                {nextCard && (
                    <div className="swipe-card swipe-card-behind">
                        <div className={`swipe-card-bg ${!nextCard.imageUrl ? `fallback-bg-${(currentIndex + 1) % 5}` : ''}`}>
                            {nextCard.imageUrl && <img src={nextCard.imageUrl} alt={nextCard.title} className="swipe-card-image" />}
                        </div>
                        <div className="swipe-card-gradient" />
                    </div>
                )}

                <div className="swipe-card swipe-card-front">
                    <div className={`swipe-card-bg ${!currentCard.imageUrl ? `fallback-bg-${currentIndex % 5}` : ''}`}>
                        {currentCard.imageUrl ? (
                            <img src={currentCard.imageUrl} alt={currentCard.title} className="swipe-card-image" />
                        ) : (
                            <div className="swipe-fallback-letter">
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
                            <span>{currentCard.releaseYear || currentCard.developer || 'Desconocido'}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="swipe-actions">
                <button className="swipe-btn swipe-btn-pass" onClick={() => handleAction('DISLIKED')}>
                    <i className="fa-solid fa-xmark"></i>
                </button>
                <button className="swipe-btn swipe-btn-info" onClick={() => setShowInfo(true)}>
                    <i className="fa-solid fa-info"></i>
                </button>
                <button className="swipe-btn swipe-btn-like" onClick={() => handleAction('LIKED')}>
                    <i className="fa-solid fa-heart"></i>
                </button>
            </div>
        </div>
    );
}
