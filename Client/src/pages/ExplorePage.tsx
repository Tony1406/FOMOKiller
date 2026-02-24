import { useState, useEffect } from 'react';
import { getCollections, getCollectionGames, searchGames, updateStatus } from '../services/api';
import GameInfoModal from '../components/GameInfoModal';
import './ExplorePage.css';

const TEMP_USER_ID = 1;

export default function ExplorePage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [collections, setCollections] = useState<any[]>([]);
    const [selectedCollection, setSelectedCollection] = useState<any>(null);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedGame, setSelectedGame] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        getCollections().then(setCollections).catch(console.error);
    }, []);

    useEffect(() => {
        if (searchTerm.trim().length > 2) {
            setLoading(true);
            searchGames(searchTerm)
                .then(setSearchResults)
                .catch(console.error)
                .finally(() => setLoading(false));
            setSelectedCollection(null);
        } else {
            setSearchResults([]);
        }
    }, [searchTerm]);

    const handleCollectionClick = async (col: any) => {
        setLoading(true);
        try {
            const data = await getCollectionGames(col.id);
            setSelectedCollection(data);
            setSearchTerm('');
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddGame = async (gameId: number) => {
        try {
            await updateStatus(TEMP_USER_ID, gameId, 'LIKED');
            setShowToast(true);
            setTimeout(() => setShowToast(false), 2500);
        } catch (error) {
            console.error("Error al añadir juego:", error);
        }
    };

    const handleOpenInfo = (game: any) => {
        setSelectedGame(game);
        setIsModalOpen(true);
    };

    const renderGameList = (games: any[]) => (
        <div className="game-list">
            {games.map((game: any) => (
                <div className="game-list-item" key={game.id}>
                    <div className="game-thumb-placeholder game-thumb-letter">
                        {game.title ? game.title.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div className="game-info">
                        <div className="game-title">{game.title}</div>
                        <div className="game-subtitle">
                            {game.developer ?? 'Desconocido'} {game.releaseYear ? `· ${game.releaseYear}` : ''}
                        </div>
                    </div>
                    <div className="game-actions">
                        <button
                            className="action-btn-secondary"
                            title="Ver info"
                            onClick={(e) => { e.stopPropagation(); handleOpenInfo(game); }}
                        >
                            <i className="fa-solid fa-info-circle"></i>
                        </button>
                        <button
                            className="action-btn-completado"
                            title="Añadir al Backlog"
                            onClick={(e) => { e.stopPropagation(); handleAddGame(game.id); }}
                        >
                            <i className="fa-solid fa-heart"></i>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="page page-padded page-enter explore-scrollable">
            {/* Search Bar */}
            <div className="search-bar search-bar-spacing">
                <i className="fa-solid fa-search search-icon"></i>
                <input
                    type="text"
                    placeholder="Busca tu próximo juego..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Resultados de Búsqueda */}
            {searchTerm.trim().length > 0 ? (
                <div className="search-results-container">
                    <div className="section-title">Resultados de búsqueda</div>
                    {loading ? (
                        <div className="section-sub">Buscando...</div>
                    ) : searchResults.length > 0 ? (
                        renderGameList(searchResults)
                    ) : (
                        <div className="section-sub">No se encontraron juegos para "{searchTerm}"</div>
                    )}
                </div>
            ) : selectedCollection ? (
                /* Vista de una Colección específica */
                <div className="collection-view-container page-enter">
                    <div className="collection-view-header">
                        <button className="back-btn-icon" onClick={() => setSelectedCollection(null)} title="Volver">
                            <i className="fa-solid fa-arrow-left"></i>
                        </button>
                        <div className="section-title" style={{ marginTop: '16px' }}>{selectedCollection.title}</div>
                        <div className="section-sub">{selectedCollection.description || "Explora los juegos de esta colección"}</div>
                    </div>

                    {loading ? (
                        <div className="section-sub">Cargando juegos...</div>
                    ) : selectedCollection.Games && selectedCollection.Games.length > 0 ? (
                        renderGameList(selectedCollection.Games)
                    ) : (
                        <div className="section-sub">Esta colección aún no tiene juegos</div>
                    )}
                </div>
            ) : (
                /* Vista de Colecciones */
                <div className="collections-container page-enter">
                    <div className="section-title">Colecciones</div>
                    <div className="section-sub">Descubre juegos curados por categoría</div>
                    <div className="collections-grid">
                        {collections.map((col) => (
                            <div
                                className={`collection-card ${col.isSystem ? 'collection-card-wide' : ''}`}
                                key={col.id}
                                onClick={() => handleCollectionClick(col)}
                            >
                                {col.imageUrl ? (
                                    <img src={col.imageUrl} alt={col.title} className="collection-card-bg" />
                                ) : (
                                    <div className="collection-icon-container bg-gradient-blue collection-icon-lg">💎</div>
                                )}
                                <div className="collection-card-overlay">
                                    <div className="collection-name">{col.title}</div>
                                    <div className="collection-count">{col.gameCount || 0} juegos</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <GameInfoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                game={selectedGame}
            />

            {showToast && (
                <div className="toast-container">
                    <div className="toast">
                        <i className="fa-solid fa-heart"></i>
                        Añadido a tu backlog
                    </div>
                </div>
            )}
        </div>
    );
}
