import './GameInfoModal.css';

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
    imageUrl?: string;
    Genres?: Genre[];
}

interface GameInfoModalProps {
    game: Game | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function GameInfoModal({ game, isOpen, onClose }: GameInfoModalProps) {
    if (!isOpen || !game) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-content ${game.imageUrl ? 'has-image' : ''}`} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                {game.imageUrl && (
                    <div className="modal-hero-image-container">
                        <img src={game.imageUrl} alt={game.title} className="modal-hero-image" />
                        <div className="modal-hero-gradient"></div>
                    </div>
                )}

                <div className="modal-header">
                    <h2>{game.title}</h2>
                    <div className="modal-meta-row">
                        <span className="modal-developer">{game.developer || 'Desconocido'}</span>
                        <span className="modal-dot">•</span>
                        <span className="modal-year">{game.releaseYear || 'N/A'}</span>
                    </div>
                </div>

                <div className="modal-body">
                    {game.Genres && game.Genres.length > 0 && (
                        <div className="modal-tags">
                            {game.Genres.map((genre) => (
                                <span key={genre.id} className="badge badge-cobalt">{genre.name}</span>
                            ))}
                        </div>
                    )}

                    <div className="modal-description">
                        <h3>Sobre el juego</h3>
                        <p>{game.description || 'No hay descripción disponible para este título.'}</p>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-primary" onClick={onClose}>Cerrar info</button>
                </div>
            </div>
        </div>
    );
}
