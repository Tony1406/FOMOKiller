import { useState, useEffect, useContext, useRef } from 'react';
import { getCollections, getCollectionGames, searchGames, updateStatus } from '../../services/api';
import GameInfoModal from '../../components/modals/GameInfoModal';
import SwipeView from '../../components/SwipeView';
import Paginador from '../../components/Paginador';
import { AuthContext } from '../../context/AuthContext';
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
    const [mostrarToast, setMostrarToast] = useState(false);
    const [enBacklog, setEnBacklog] = useState<Set<number>>(new Set());
    const [vista, setVista] = useState<VistaValue>(
        () => {
            const stored = localStorage.getItem('fomo_vista_explore');
            return (stored === 'lista' || stored === 'cards' || stored === 'swipe') ? stored as VistaValue : 'lista';
        }
    );
    const [swipeIndex, setSwipeIndex] = useState(0);

    useEffect(() => { localStorage.setItem('fomo_vista_explore', vista); }, [vista]);
    useEffect(() => { setPaginaSearch(1); }, [buscar]);
    useEffect(() => { setSwipeIndex(0); }, [coleccionSeleccionada?.id]);

    const cargaInicial = async () => {
        const data = await getCollections();
        setColecciones(data);
    };

    useEffect(() => {
        cargaInicial();
    }, []);

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
            setMostrarToast(true);
            setTimeout(() => setMostrarToast(false), 1500);
        }
    };

    const searchToggle = (
        <div className="view-toggle-group">
            <button
                className={`view-toggle-btn${vista === 'lista' ? ' active' : ''}`}
                onClick={() => setVista('lista')}
                title="Vista lista"
            >
                <i className="fa-solid fa-list" />
            </button>
            <button
                className={`view-toggle-btn${vista === 'cards' ? ' active' : ''}`}
                onClick={() => setVista('cards')}
                title="Vista cuadrícula"
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
                title="Vista lista"
            >
                <i className="fa-solid fa-list" />
            </button>
            <button
                className={`view-toggle-btn${vista === 'cards' ? ' active' : ''}`}
                onClick={() => setVista('cards')}
                title="Vista cuadrícula"
            >
                <i className="fa-solid fa-grip" />
            </button>
            <button
                className={`view-toggle-btn${vista === 'swipe' ? ' active' : ''}`}
                onClick={() => { setVista('swipe'); setSwipeIndex(0); }}
                title="Vista swipe"
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
                                        <div className="game-card-backlog-stamp">GUARDADO</div>
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
                                            title={estaEnBacklog ? 'Quitar del backlog' : 'Añadir al backlog'}
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

    // ── Swipe mode for collection ─────────────────
    if (vista === 'swipe' && coleccionSeleccionada !== null) {
        return (
            <div className="page page-enter page-swipe-mode">
                <div className="swipe-mode-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <button className="back-btn-icon" onClick={() => setVista('lista')} style={{ flexShrink: 0 }}>
                            <i className="fa-solid fa-arrow-left" />
                        </button>
                        <div>
                            <div className="section-title">{coleccionSeleccionada.title}</div>
                            <div className="section-sub">{coleccionSeleccionada.Games.length} juegos</div>
                        </div>
                    </div>
                    {collectionToggle}
                </div>

                <SwipeView
                    items={coleccionSeleccionada.Games}
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
                    onLeft={async () => { /* skip */ }}
                    onRight={async (game) => {
                        if (!user) return;
                        if (!enBacklog.has(game.id)) {
                            await updateStatus(user.id, game.id, 'LIKED');
                            setEnBacklog(prev => new Set(prev).add(game.id));
                            setMostrarToast(true);
                            setTimeout(() => setMostrarToast(false), 1500);
                        }
                    }}
                    leftLabel="Saltar"
                    rightLabel="Backlog"
                    doneMessage="Has explorado toda la colección"
                />

                {mostrarToast && (
                    <div className="toast-container">
                        <div className="toast"><i className="fa-solid fa-heart" /> Añadido a tu backlog</div>
                    </div>
                )}
            </div>
        );
    }

    // ── Normal mode ──────────────────────────────
    let vistaPrincipal;

    if (buscar.trim().length > 0) {
        vistaPrincipal = (
            <div className="search-results-container">
                <div className="search-results-header">
                    <div className="collection-view-toolbar search-results-toolbar">
                        <div className="section-title">Resultados de búsqueda</div>
                        {searchToggle}
                    </div>
                    <div className="backlog-legend explore-legend">
                        <div className="backlog-legend-item"><i className="fa-solid fa-heart" /><span>Añadir al backlog</span></div>
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
                    <div className="section-sub">No hemos encontrado nada para "{buscar}"</div>
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
                        <div className="backlog-legend-item"><i className="fa-solid fa-heart" /><span>Añadir al backlog</span></div>
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
                <div className="section-title">Explorar</div>
                <div className="section-sub">Descubre nuevos juegos por categorías</div>

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
                    placeholder="Busca tu próximo juego..."
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

            {mostrarToast && (
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
