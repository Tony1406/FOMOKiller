import { useState, useEffect } from 'react';
import { getCollections, getCollectionGames, searchGames, updateStatus, USER_ID } from '../../services/api';
import GameInfoModal from '../../components/modals/GameInfoModal';
import './ExplorePage.css';


export default function ExplorePage() {
    const [buscar, setBuscar] = useState('');
    const [colecciones, setColecciones] = useState<any[]>([]);
    const [coleccionSeleccionada, setColeccionSeleccionada] = useState<any>(null);
    const [buscarResultados, setBuscarResultados] = useState<any[]>([]);
    const [juegoSeleccionado, setJuegoSeleccionado] = useState<any>(null);
    const [mostrarToast, setMostrarToast] = useState(false);
    const [enBacklog, setEnBacklog] = useState<Set<number>>(new Set());

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
        setBuscar('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddGame = async (gameId: number) => {
        if (enBacklog.has(gameId)) {
            // Ya está en el backlog → quitarlo
            await updateStatus(USER_ID, gameId, 'DROPPED');
            setEnBacklog(prev => {
                const next = new Set(prev);
                next.delete(gameId);
                return next;
            });
        } else {
            // No está → añadirlo
            await updateStatus(USER_ID, gameId, 'LIKED');
            setEnBacklog(prev => new Set(prev).add(gameId));
            setMostrarToast(true);
            setTimeout(() => setMostrarToast(false), 1500);
        }
    };

    const renderGames = (games: any[]) => (
        <div className="game-list">
            {games.map((game: any) => {
                const estaEnBacklog = enBacklog.has(game.id);
                return (
                    <div className="game-list-item" key={game.id}>
                        <div className="game-thumb-placeholder game-thumb-letter">
                            {game.title[0].toUpperCase()}
                        </div>
                        <div className="game-info">
                            <div className="game-title">{game.title}</div>
                            <div className="game-subtitle">
                                {game.developer} {game.releaseYear}
                            </div>
                        </div>
                        <div className="game-actions">
                            <button className="action-btn-secondary" onClick={() => setJuegoSeleccionado(game)} >
                                <i className="fa-solid fa-info-circle"></i>
                            </button>
                            <button
                                className={`action-btn-completado${estaEnBacklog ? ' action-btn-completado--active' : ''}`}
                                onClick={() => handleAddGame(game.id)}
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


    let vistaPrincipal;

    if (buscar.trim().length > 0) {
        vistaPrincipal = (
            <div className="search-results-container">
                <div className="section-title">Resultados de búsqueda</div>
                {buscarResultados.length > 0 ? (
                    renderGames(buscarResultados)
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
                </div>

                {renderGames(coleccionSeleccionada.Games)}
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
                                <div className="collection-count">{coleccion.gameCount} juegos</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    let avisoToast = null;
    if (mostrarToast === true) {
        avisoToast = (
            <div className="toast-container">
                <div className="toast">
                    <i className="fa-solid fa-heart"></i>
                    Añadido a tu backlog
                </div>
            </div>
        );
    }

    return (

        <div className="page page-padded page-enter explore-scrollable">
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

            {avisoToast}
        </div>
    );
}
