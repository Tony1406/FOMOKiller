import { useState, useRef, useEffect } from "react";
import GameInfoModal from "./modals/GameInfoModal";
import { getPlatformIcons } from "../utils/platformIcons";
import "./SwipeView.css";

const DRAG_THRESHOLD = 90;

export interface SwipeGameData {
    id: number;
    title: string;
    imageUrl?: string;
    releaseYear?: number;
    developer?: string;
    playtime?: number;
    rawgSlug?: string;
    Platforms?: { id: number; name: string }[];
    Genres?: { id: number; name: string }[];
}

interface SwipeViewProps {
    items: any[];
    index: number;
    onIndexChange: (n: number) => void;
    getGame: (item: any) => SwipeGameData;
    onLeft: (item: any) => Promise<void>;
    onRight: (item: any) => Promise<void>;
    onExtra?: (item: any) => Promise<void>;
    leftLabel?: string;
    rightLabel?: string;
    extraLabel?: string;
    extraIcon?: string;
    extraColor?: string;
    doneMessage?: string;
}

export default function SwipeView({
    items,
    index,
    onIndexChange,
    getGame,
    onLeft,
    onRight,
    onExtra,
    leftLabel = "Drop",
    rightLabel = "Keep",
    extraLabel = "Top 5",
    extraIcon = "fa-solid fa-ranking-star",
    extraColor = "#f5c518",
    doneMessage = "You've reviewed all games",
}: SwipeViewProps) {
    const [mostrarInfo, setMostrarInfo] = useState(false);
    const [dragX, setDragX] = useState(0);
    const [flyOut, setFlyOut] = useState<"left" | "right" | "extra" | null>(null);
    const [flyIn, setFlyIn] = useState(false);
    const [slidingIn, setSlidingIn] = useState(false);
    const isDraggingRef = useRef(false);
    const startXRef = useRef(0);
    const swipingRef = useRef(false);

    const onLeftRef = useRef(onLeft);
    const onRightRef = useRef(onRight);
    const onExtraRef = useRef(onExtra);
    onLeftRef.current = onLeft;
    onRightRef.current = onRight;
    onExtraRef.current = onExtra;

    const triggerSwipe = async (direction: "left" | "right" | "extra") => {
        if (swipingRef.current || index >= items.length) return;
        swipingRef.current = true;
        setFlyOut(direction);
        await new Promise((r) => setTimeout(r, 380));
        const item = items[index];
        if (direction === "left") await onLeftRef.current(item);
        else if (direction === "right") await onRightRef.current(item);
        else if (direction === "extra" && onExtraRef.current) await onExtraRef.current(item);
        onIndexChange(index + 1);
        setFlyOut(null);
        setDragX(0);
        swipingRef.current = false;
    };

    const handleRetroceder = () => {
        if (swipingRef.current || index <= 0) return;
        setFlyIn(true);
        onIndexChange(index - 1);
        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                setFlyIn(false);
                setSlidingIn(true);
                setTimeout(() => setSlidingIn(false), 400);
            }),
        );
    };

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        if (mostrarInfo || swipingRef.current) return;
        isDraggingRef.current = true;
        startXRef.current = e.clientX;
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: React.PointerEvent) => {
        if (!isDraggingRef.current) return;
        setDragX(e.clientX - startXRef.current);
    };

    const onPointerUp = () => {
        if (!isDraggingRef.current) return;
        isDraggingRef.current = false;
        if (dragX > DRAG_THRESHOLD) triggerSwipe("right");
        else if (dragX < -DRAG_THRESHOLD) triggerSwipe("left");
        else setDragX(0);
    };

    const triggerSwipeRef = useRef(triggerSwipe);
    const handleRetrocederRef = useRef(handleRetroceder);

    useEffect(() => {
        triggerSwipeRef.current = triggerSwipe;
        handleRetrocederRef.current = handleRetroceder;
    });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (mostrarInfo) {
                if (e.key === "Escape" || e.key === "Enter") setMostrarInfo(false);
                return;
            }
            if (index >= items.length) return;
            switch (e.key) {
                case "ArrowLeft":
                    triggerSwipeRef.current("left");
                    break;
                case "ArrowRight":
                    triggerSwipeRef.current("right");
                    break;
                case "ArrowUp":
                    e.preventDefault();
                    setMostrarInfo(true);
                    break;
                case "ArrowDown":
                    e.preventDefault();
                    handleRetrocederRef.current();
                    break;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [mostrarInfo, index, items.length]);


    if (index >= items.length) {
        return (
            <div className="swipe-view-done">
                <i className="fa-solid fa-check-circle swipe-view-done-icon" />
                <div className="swipe-view-done-text">{doneMessage}</div>
            </div>
        );
    }

    const item = items[index];
    const game = getGame(item);
    const nextItem = items[index + 1];
    const nextGame = nextItem ? getGame(nextItem) : null;

    const progress = Math.min(Math.abs(dragX) / DRAG_THRESHOLD, 1);
    const isExtraFly = flyOut === "extra";
    const isRightish = dragX > 20 || flyOut === "right";
    const isLeftish = (dragX < -20 || flyOut === "left") && !isExtraFly;

    const rotation = flyOut
        ? (flyOut === "right" ? 20 : -20)
        : dragX * 0.07;

    const translateX = flyOut
        ? (flyOut === "right" ? "150vw" : "-150vw")
        : flyIn ? "60vw"
        : `${dragX}px`;

    const cardTransition = flyOut
        ? "transform 0.38s cubic-bezier(0.4, 0, 1, 1)"
        : flyIn || isDraggingRef.current
            ? "none"
            : slidingIn
                ? "transform 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                : "none";

    const stampOpacity = flyOut ? 1 : progress;
    const overlayOpacity = flyOut ? 0.32 : progress * 0.32;

    return (
        <div className="swipe-view">
            <GameInfoModal
                isOpen={mostrarInfo}
                onClose={() => setMostrarInfo(false)}
                game={game as any}
            />

            <div className="swipe-stack">
                <div className="swipe-keyboard-hints">
                    <div className="swipe-hint"><kbd>←</kbd><span>{leftLabel}</span></div>
                    <div className="swipe-hint"><kbd>→</kbd><span>{rightLabel}</span></div>
                    <div className="swipe-hint"><kbd>↑</kbd><span>Info</span></div>
                    <div className="swipe-hint"><kbd>↓</kbd><span>Back</span></div>
                </div>

                <div className="swipe-image-glow" key={game.id}>
                    <img src={game.imageUrl} alt="" aria-hidden />
                </div>

                {nextGame && (
                    <div className="swipe-card swipe-card-back">
                        <div className="swipe-card-bg">
                            <img src={nextGame.imageUrl} alt={nextGame.title} className="swipe-card-image" />
                        </div>
                        <div className="swipe-card-gradient" />
                        <div className="swipe-card-info">
                            <div className="swipe-card-title">{nextGame.title}</div>
                        </div>
                    </div>
                )}

                <div
                    className="swipe-card swipe-card-front"
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerUp}
                    style={{
                        transform: `translateX(${translateX}) rotate(${rotation}deg)`,
                        transition: cardTransition,
                        touchAction: "none",
                    }}
                >
                    <div className="swipe-card-bg">
                        <img src={game.imageUrl} alt={game.title} className="swipe-card-image" />
                    </div>
                    <div className="swipe-card-gradient" />

                    {isRightish && (
                        <div className="swipe-card-drag-overlay swipe-drag-like" style={{ opacity: overlayOpacity }} />
                    )}
                    {isLeftish && (
                        <div className="swipe-card-drag-overlay swipe-drag-nope" style={{ opacity: overlayOpacity }} />
                    )}
                    {isExtraFly && (
                        <div
                            className="swipe-drag-extra-overlay"
                            style={{ opacity: overlayOpacity, background: extraColor }}
                        />
                    )}

                    {isRightish && (
                        <div className="swipe-stamp swipe-stamp--like" style={{ opacity: stampOpacity }}>
                            {rightLabel}
                        </div>
                    )}
                    {isLeftish && (
                        <div className="swipe-stamp swipe-stamp--nope" style={{ opacity: stampOpacity }}>
                            {leftLabel}
                        </div>
                    )}
                    {isExtraFly && (
                        <div
                            className="swipe-stamp swipe-stamp--extra"
                            style={{ opacity: stampOpacity, color: extraColor, borderColor: extraColor }}
                        >
                            {extraLabel}
                        </div>
                    )}

                    <div className="swipe-card-platforms">
                        {getPlatformIcons(game.Platforms ?? []).map((icon, i) => (
                            <div key={i} className="swipe-card-platform">
                                <i className={icon} />
                            </div>
                        ))}
                    </div>

                    <div className="swipe-card-info">
                        <div className="swipe-card-topmeta">
                            {game.releaseYear && <span className="swipe-tag">{game.releaseYear}</span>}
                            {(game.playtime ?? 0) > 0 && <span className="swipe-tag">~{game.playtime}h</span>}
                        </div>
                        <div className="swipe-card-title">{game.title}</div>
                        {(() => {
                            const sub =
                                game.developer ??
                                game.Genres?.slice(0, 2).map((g: any) => g.name).join(" · ") ??
                                null;
                            return sub ? <div className="swipe-card-developer">{sub}</div> : null;
                        })()}
                    </div>
                </div>
            </div>

            <div className="swipe-actions">
                <button
                    className="swipe-btn swipe-btn-back"
                    onClick={handleRetroceder}
                    disabled={index <= 0}
                    title="Back"
                >
                    <i className="fa-solid fa-rotate-left" />
                </button>
                <button
                    className="swipe-btn swipe-btn-pass"
                    onClick={() => triggerSwipe("left")}
                    title={leftLabel}
                >
                    <i className="fa-solid fa-xmark" />
                </button>
                <button
                    className="swipe-btn swipe-btn-info"
                    onClick={() => setMostrarInfo(true)}
                    title="Info"
                >
                    <i className="fa-solid fa-info" />
                </button>
                {onExtra && (
                    <button
                        className="swipe-btn swipe-btn-extra"
                        style={{ "--extra-col": extraColor } as React.CSSProperties}
                        onClick={() => triggerSwipe("extra")}
                        title={extraLabel}
                    >
                        <i className={extraIcon} />
                    </button>
                )}
                <button
                    className="swipe-btn swipe-btn-like"
                    onClick={() => triggerSwipe("right")}
                    title={rightLabel}
                >
                    <i className="fa-solid fa-heart" />
                </button>
            </div>
        </div>
    );
}
