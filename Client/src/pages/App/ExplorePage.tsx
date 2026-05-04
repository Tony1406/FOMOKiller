import { useState, useEffect, useContext, useRef } from 'react';
import { getCollections, getCollectionGames, searchGames, updateStatus, getBacklog } from '../../services/api';
import GameInfoModal from '../../components/modals/GameInfoModal';
import SwipeView from '../../components/SwipeView';
import Paginador from '../../components/Paginador';
import { AuthContext } from '../../auth/AuthContext';
import './ExplorePage.css';
import '../../components/Paginador.css';

type VistaValue = 'lista' | 'cards' | 'swipe';

export default function ExplorePage() {
    const { user } = useContext(AuthContext);
    const pageRef = useRef<HTMLDivElement>(null);
    const scrollTop = () => pageRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    const [buscar, setBuscar] = useState('');
    const [colecciones, setColecciones] = useState<any[]>([]);
    const [coleccionSeleccionada, setColeccionSeleccionada] = useState<any>(null);
    const [buscarResultados, setBuscarResultados] = useState<any[]>([]);
    const [paginaSearch, setPaginaSearch] = useState(1);
    const [paginaColeccion, setPaginaColeccion] = useState(1);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState<any>(null);
    const [toastMsg, setToastMsg] = useState<string | null>(null);
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
        setToastMsg(msg);
        setToastType(type);
        setTimeout(() => setToastMsg(null), 2000);
    };
    const [enBacklog, setEnBacklog] = useState<Set<number>>(new Set());
    const [vista, setVista] = useState<VistaValue>(
        () => {
            const stored = localStorage.getItem('fomo_vista_explore');
            return (stored === 'lista' || stored === 'cards' || stored === 'swipe') ? stored as VistaValue : 'lista';
        }
    );
    const [swipeIndex, setSwipeIndex] = useState(0);
    const [swipeDeck, setSwipeDeck] = useState<any[]>([]);

    useEffect(() => { localStorage.setItem('fomo_vista_explore', vista); }, [vista]);
    useEffect(() => { setPaginaSearch(1); }, [buscar]);
    useEffect(() => { setSwipeIndex(0); setSwipeDeck([]); }, [coleccionSeleccionada?.id]);

    const cargaInicial = async () => {
        const data = await getCollections();
        setColecciones(data);
        if (user) {
            const backlogData = await getBacklog(user.id);
            if (Array.isArray(backlogData)) {
                setEnBacklog(new Set(backlogData.map((ug: any) => ug.gameId)));
            }
        }
    };

    useEffect(() => {
        cargaInicial();
    }, [user?.id]);

    const busquedaAfinada = async () => {
        if (buscar.trim().length >= 1) {
            const results = await searchGames(buscar);
            setBuscarResultados(results);
            setColeccionSeleccionada(null);
        } else {
            setBuscarResultados([]);
        }
    };

    useEffect(() => {
        const delayBusqueda = setTimeout(() => {
            busquedaAfinada();
        }, 300);
        return () => clearTimeout(delayBusqueda);
    }, [buscar]);

    const handleOpenCollection = async (collection: any) => {
        const coleccionCompleta = await getCollectionGames(collection.id);
        setColeccionSeleccionada(coleccionCompleta);
        setPaginaColeccion(1);
        setBuscar('');
        scrollTop();
    };

    const handleAddGame = async (gameId: number) => {
        if (!user) return;
        if (enBacklog.has(gameId)) {
            await updateStatus(user.id, gameId, 'DROPPED');
            setEnBacklog(prev => {
                const next = new Set(prev);
                next.delete(gameId);
                return next;
            });
        } else {
            await updateStatus(user.id, gameId, 'LIKED');
            setEnBacklog(prev => new Set(prev).add(gameId));
            showToast('Added to your backlog');
        }
    };

    const searchToggle = (
        <div className="view-toggle-group">
            <button
                className={`view-toggle-btn${vista === 'lista' ? ' active' : ''}`}
                onClick={() => setVista('lista')}
                title="List view"
            >
                <i className="fa-solid fa-list" />
            </button>
            <button
                className={`view-toggle-btn${vista === 'cards' ? ' active' : ''}`}
                onClick={() => setVista('cards')}
                title="Grid view"
            >
                <i className="fa-solid fa-grip" />
            </button>
        </div>
    );

    const collectionToggle = (
        <div className="view-toggle-group">
            <button
                className={`view-toggle-btn${vista === 'lista' ? ' active' : ''}`}
                onClick={() => setVista('lista')}
                title="List view"
            >
                <i className="fa-solid fa-list" />
            </button>
            <button
                className={`view-toggle-btn${vista === 'cards' ? ' active' : ''}`}
                onClick={() => setVista('cards')}
                title="Grid view"
            >
                <i className="fa-solid fa-grip" />
            </button>
            <button
                className={`view-toggle-btn${vista === 'swipe' ? ' active' : ''}`}
                onClick={() => { setSwipeIndex(0); setSwipeDeck([...(coleccionSeleccionada?.Games ?? [])].sort(() => Math.random() - 0.5)); setVista('swipe'); }}
                title="Swipe view"
            >
                <i className="fa-solid fa-layer-group" />
            </button>
        </div>
    );

    const renderGames = (games: any[]) => {
        if (vista === 'cards') {
            return (
                <div className="game-grid" key="cards">
                    {games.map((game: any) => {
                        const estaEnBacklog = enBacklog.has(game.id);
                        return (
                            <div key={game.id} className={`game-card${estaEnBacklog ? " game-card--guardado" : ""}`} onClick={() => setJuegoSeleccionado(game)}>
                                <div className="game-card-img-wrap">
                                    {game.imageUrl
                                        ? <img src={game.imageUrl} alt={game.title} className="game-card-image" />
                                        : <div className="game-card-no-image">{game.title[0].toUpperCase()}</div>
                                    }
                                </div>
                                {estaEnBacklog && (
                                    <>
                                        <div className="game-card-backlog-overlay" />
                                        <div className="game-card-backlog-stamp">SAVED</div>
                                    </>
                                )}
                                <div className="game-card-gradient" />
                                <div className="game-card-info">
                                    <div className="game-card-title">{game.title}</div>
                                    <div className="game-card-subtitle">{game.developer} · {game.releaseYear}</div>
                                    <div className="game-card-actions">
                                        <button
                                            className={`action-btn-completado${estaEnBacklog ? ' action-btn-completado--active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); handleAddGame(game.id); }}
                                            title={estaEnBacklog ? 'Remove from backlog' : 'Add to backlog'}
                                        >
                                            <i className="fa-solid fa-heart"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return (
            <div className="game-list" key="lista">
                {games.map((game: any) => {
                    const estaEnBacklog = enBacklog.has(game.id);
                    return (
                        <div className="game-list-item" key={game.id} onClick={() => setJuegoSeleccionado(game)}>
                            {game.imageUrl
                                ? <img src={game.imageUrl} alt={game.title} className="game-thumb-img" />
                                : <div className="game-thumb-placeholder game-thumb-letter">{game.title[0].toUpperCase()}</div>
                            }
                            <div className="game-info">
                                <div className="game-title">{game.title}</div>
                                <div className="game-subtitle">
                                    {[game.developer, game.releaseYear].filter(Boolean).join(' · ')}
                                </div>
                            </div>
                            <div className="game-actions">
                                <button
                                    className={`action-btn-completado${estaEnBacklog ? ' action-btn-completado--active' : ''}`}
                                    onClick={(e) => { e.stopPropagation(); handleAddGame(game.id); }}
                                    title={estaEnBacklog ? 'Quitar del backlog' : 'Añadir al backlog'}
                                >
                                    <i className="fa-solid fa-heart"></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    if (vista === 'swipe' && coleccionSeleccionada !== null) {
        return (
            <div className="page page-enter page-swipe-mode">
                <div className="swipe-mode-bar">
                    <div className="swipe-mode-bar-left">
                        <button className="back-btn-icon" onClick={() => setVista('lista')}>
                            <i className="fa-solid fa-arrow-left" />
                        </button>
                        <div>
                            <div className="section-title">{coleccionSeleccionada.title}</div>
                            <div className="section-sub">{coleccionSeleccionada.Games.length} games</div>
                        </div>
                    </div>
                    {collectionToggle}
                </div>

                <SwipeView
                    items={swipeDeck.length > 0 ? swipeDeck : coleccionSeleccionada.Games}
                    index={swipeIndex}
                    onIndexChange={setSwipeIndex}
                    getGame={(game) => ({
                        id: game.id,
                        title: game.title,
                        imageUrl: game.imageUrl,
                        releaseYear: game.releaseYear,
                        developer: game.developer,
                        playtime: game.playtime,
                        rawgSlug: game.rawgSlug,
                        Platforms: game.Platforms,
                        Genres: game.Genres,
                    })}
                    canSwipe={(game, direction) => {
                        if (direction === 'right' && enBacklog.has(game.id)) {
                            showToast('Already in your backlog', 'error');
                            return false;
                        }
                        return true;
                    }}
                    onLeft={async () => { /* skip */ }}
                    onRight={async (game) => {
                        if (!user) return;
                        await updateStatus(user.id, game.id, 'LIKED');
                        setEnBacklog(prev => new Set(prev).add(game.id));
                        showToast('Added to your backlog');
                    }}
                    leftLabel="Skip"
                    rightLabel="Backlog"
                    doneMessage="You've explored the whole collection"
                />

                {toastMsg && (
                    <div className="toast-container">
                        <div className={`toast${toastType === 'error' ? ' toast-error' : ''}`}>{toastMsg}</div>
                    </div>
                )}
            </div>
        );
    }

    let vistaPrincipal;

    if (buscar.trim().length > 0) {
        vistaPrincipal = (
            <div className="search-results-container">
                <div className="search-results-header">
                    <div className="collection-view-toolbar search-results-toolbar">
                        <div className="section-title">Search results</div>
                        {searchToggle}
                    </div>
                    <div className="backlog-legend explore-legend">
                        <div className="backlog-legend-item"><i className="fa-solid fa-heart" /><span>Add to backlog</span></div>
                    </div>
                </div>
                {buscarResultados.length > 0 ? (
                    <>
                        {renderGames(buscarResultados.slice((paginaSearch - 1) * 18, paginaSearch * 18))}
                        <Paginador
                            pagina={paginaSearch}
                            total={buscarResultados.length}
                            porPagina={18}
                            onChange={p => { setPaginaSearch(p); scrollTop(); }}
                        />
                    </>
                ) : (
                    <div className="section-sub">No results found for "{buscar}"</div>
                )}
            </div>
        );
    } else if (coleccionSeleccionada !== null) {
        vistaPrincipal = (
            <div className="collection-view-container page-enter">
                <div className="collection-view-header">
                    <button className="back-btn-icon" onClick={() => setColeccionSeleccionada(null)}>
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <div className="section-title">{coleccionSeleccionada.title}</div>
                    <div className="section-sub">{coleccionSeleccionada.description}</div>
                    <div className="collection-view-toolbar">
                        {collectionToggle}
                    </div>
                    <div className="backlog-legend explore-legend">
                        <div className="backlog-legend-item"><i className="fa-solid fa-heart" /><span>Add to backlog</span></div>
                    </div>
                </div>

                {renderGames(coleccionSeleccionada.Games.slice((paginaColeccion - 1) * 18, paginaColeccion * 18))}
                <Paginador
                    pagina={paginaColeccion}
                    total={coleccionSeleccionada.Games.length}
                    porPagina={18}
                    onChange={p => { setPaginaColeccion(p); scrollTop(); }}
                />
            </div>
        );
    } else {
        vistaPrincipal = (
            <div className="collections-container page-enter">
                <div className="section-title">Explore</div>
                <div className="section-sub">Discover new games by category</div>

                <div className="collections-grid">
                    {colecciones.map((coleccion) => (
                        <div key={coleccion.id} className="collection-card" onClick={() => handleOpenCollection(coleccion)}>
                            <img src={coleccion.imageUrl} className="collection-card-bg" />
                            <div className="collection-card-overlay">
                                <div className="collection-name">{coleccion.title}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="page page-padded page-enter explore-scrollable" ref={pageRef}>
            <div className="search-bar search-bar-spacing">
                <i className="fa-solid fa-search search-icon"></i>
                <input
                    type="text"
                    placeholder="Search your next game..."
                    value={buscar}
                    onChange={(e) => setBuscar(e.target.value)}
                />
            </div>
            {vistaPrincipal}

            <GameInfoModal
                isOpen={juegoSeleccionado !== null}
                onClose={() => setJuegoSeleccionado(null)}
                game={juegoSeleccionado}
            />

            {toastMsg && (
                <div className="toast-container">
                    <div className={`toast${toastType === 'error' ? ' toast-error' : ''}`}>{toastMsg}</div>
                </div>
            )}
        </div>
    );
}
