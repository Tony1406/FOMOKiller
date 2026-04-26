import { useState, useEffect } from 'react';
import { getGameDetails } from '../../services/api';
import './GameInfoModal.css';

interface Game {
    id: number;
    title: string;
    description?: string;
    releaseYear?: number | null;
    developer?: string | null;
    imageUrl?: string | null;
    rawgSlug?: string | null;
    playtime?: number;
    Genres?: { id: number; name: string }[];
    Platforms?: { id: number; name: string }[];
}

interface RawgDetails {
    description: string | null;
    developer: string | null;
    publisher: string | null;
    esrb: string | null;
    website: string | null;
    trailer: string | null;
    screenshots: string[];
}

interface GameInfoModalProps {
    game: Game | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function GameInfoModal({ game, isOpen, onClose }: GameInfoModalProps) {
    const [details, setDetails] = useState<RawgDetails | null>(null);
    const [loadingDetails, setLoadingDetails] = useState(false);
    const [slideIndex, setSlideIndex] = useState(0);
    const [descExpanded, setDescExpanded] = useState(false);

    useEffect(() => {
        if (!isOpen || !game?.rawgSlug) return;
        setDetails(null);
        setSlideIndex(0);
        setDescExpanded(false);
        setLoadingDetails(true);
        getGameDetails(game.rawgSlug)
            .then(data => setDetails(data))
            .finally(() => setLoadingDetails(false));
    }, [isOpen, game?.rawgSlug]);

    useEffect(() => {
        if (!isOpen) return;
        const total = (game?.imageUrl ? 1 : 0) + (details?.screenshots?.length ?? 0);
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowLeft') { e.stopPropagation(); setSlideIndex(i => (i - 1 + total) % Math.max(total, 1)); }
            else if (e.key === 'ArrowRight') { e.stopPropagation(); setSlideIndex(i => (i + 1) % Math.max(total, 1)); }
            else if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onClose(); }
        };
        window.addEventListener('keydown', handleKey, true);
        return () => window.removeEventListener('keydown', handleKey, true);
    }, [isOpen, game?.imageUrl, details?.screenshots?.length]);

    if (!isOpen || !game) return null;

    const images = [
        ...(game.imageUrl ? [game.imageUrl] : []),
        ...(details?.screenshots ?? []),
    ];

    const prevSlide = () => setSlideIndex(i => (i - 1 + images.length) % images.length);
    const nextSlide = () => setSlideIndex(i => (i + 1) % images.length);

    const developer = details?.developer ?? game.developer ?? null;
    const description = details?.description ?? game.description ?? null;
    const DESC_LIMIT = 220;
    const descTruncated = description && description.length > DESC_LIMIT && !descExpanded
        ? description.slice(0, DESC_LIMIT) + '...'
        : description;

    const infoRows = [
        developer && { icon: 'fa-solid fa-code', label: 'Developer', value: developer },
        details?.publisher && details.publisher && { icon: 'fa-solid fa-building', label: 'Publisher', value: details.publisher },
        game.releaseYear && { icon: 'fa-solid fa-calendar', label: 'Release', value: String(game.releaseYear) },
        (game.playtime ?? 0) > 0 && { icon: 'fa-solid fa-clock', label: 'Avg. playtime', value: `~${game.playtime}h` },
        details?.esrb && details.esrb.trim() && { icon: 'fa-solid fa-shield-halved', label: 'Rating', value: details.esrb },
    ].filter(row => row && (row as any).value) as { icon: string; label: string; value: string }[];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content has-image" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                <div className="modal-carousel">
                    {images.length > 0 && (
                        <img
                            key={images[slideIndex]}
                            src={images[slideIndex]}
                            className="modal-hero-image"
                            alt={game.title}
                        />
                    )}
                    <div className="modal-hero-gradient" />

                    {images.length > 1 && (
                        <>
                            <button className="carousel-btn carousel-btn--prev" onClick={prevSlide}>
                                <i className="fa-solid fa-chevron-left" />
                            </button>
                            <button className="carousel-btn carousel-btn--next" onClick={nextSlide}>
                                <i className="fa-solid fa-chevron-right" />
                            </button>
                            <div className="carousel-dots">
                                {images.map((_, i) => (
                                    <button
                                        key={i}
                                        className={`carousel-dot ${i === slideIndex ? 'active' : ''}`}
                                        onClick={() => setSlideIndex(i)}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="modal-body">
                    <div className="modal-title-block">
                        <h2 className="modal-title">{game.title}</h2>
                        <div className="modal-genres">
                            {game.Genres?.map(genre => (
                                <span key={genre.id} className="badge badge-cobalt">{genre.name}</span>
                            ))}
                        </div>
                    </div>

                    {(infoRows.length > 0 || loadingDetails || (game.Platforms?.length ?? 0) > 0) && (
                        <div className="modal-details-scroll">
                            {loadingDetails && infoRows.length === 0 && (
                                <div className="modal-detail-card">
                                    <i className="fa-solid fa-spinner fa-spin modal-detail-icon" />
                                    <span className="modal-detail-label">Loading...</span>
                                </div>
                            )}
                            {infoRows.map(row => (
                                <div key={row.label} className="modal-detail-card">
                                    <i className={`${row.icon} modal-detail-icon`} />
                                    <span className="modal-detail-value">{row.value}</span>
                                    <span className="modal-detail-label">{row.label}</span>
                                </div>
                            ))}
                            {(game.Platforms?.length ?? 0) > 0 && (
                                <div className="modal-detail-card modal-detail-platforms">
                                    <i className="fa-solid fa-display modal-detail-icon" />
                                    <div className="modal-platform-names">
                                        {game.Platforms!.map((p, i, arr) => (
                                            <span key={p.id} className="modal-platform-name">
                                                {p.name}{i < arr.length - 1 ? ',\u00A0' : ''}
                                            </span>
                                        ))}
                                    </div>
                                    <span className="modal-detail-label">Platforms</span>
                                </div>
                            )}
                        </div>
                    )}

                    {descTruncated && (
                        <div className="modal-description-block">
                            <div className="modal-section-title">
                                <i className="fa-solid fa-align-left" />
                                About the game
                            </div>
                            <p className="modal-desc-text">{descTruncated}</p>
                            {description && description.length > DESC_LIMIT && (
                                <button
                                    className="modal-desc-toggle"
                                    onClick={() => setDescExpanded(v => !v)}
                                >
                                    {descExpanded ? 'Show less' : 'Read more'}
                                </button>
                            )}
                        </div>
                    )}

                    {details?.trailer && (
                        <div className="modal-trailer-block">
                            <div className="modal-section-title">
                                <i className="fa-solid fa-clapperboard" />
                                Trailer
                            </div>
                            <video
                                src={details.trailer}
                                controls
                                className="modal-trailer-video"
                                poster={game.imageUrl}
                            />
                        </div>
                    )}

                    {details?.website && (
                        <a
                            href={details.website}
                            target="_blank"
                            rel="noreferrer"
                            className="modal-website-btn"
                        >
                            <i className="fa-solid fa-arrow-up-right-from-square" />
                            Official website
                        </a>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="btn-primary" onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
}
