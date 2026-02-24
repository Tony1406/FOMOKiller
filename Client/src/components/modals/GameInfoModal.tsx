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
    if (isOpen === false) {
        return null;
    }
    if (game === null) {
        return null;
    }


    let claseContenido = "modal-content";
    if (game.imageUrl) {
        claseContenido = "modal-content has-image";
    }

    let textoDescripcion = game.description;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className={claseContenido} onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                <div className="modal-hero-image-container">
                    <img src={game.imageUrl} className="modal-hero-image" />
                    <div className="modal-hero-gradient"></div>
                </div>

                <div className="modal-header">
                    <h2>{game.title}</h2>
                    <div className="modal-meta-row">
                        <span className="modal-developer">{game.developer}</span>
                        <span className="modal-dot">•</span>
                        <span className="modal-year">{game.releaseYear}</span>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="modal-tags">
                        {game.Genres?.map((genre) => (
                            <span key={genre.id} className="badge badge-cobalt">{genre.name}</span>
                        ))}
                    </div>

                    <div className="modal-description">
                        <h3>Sobre el juego</h3>
                        <p>{textoDescripcion}</p>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn-primary" onClick={onClose}>Cerrar info</button>
                </div>
            </div>
        </div>
    );
}
