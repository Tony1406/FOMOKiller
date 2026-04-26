import { useState, useEffect, useRef, useContext } from "react";
import GameInfoModal from "../../components/modals/GameInfoModal";
import { getRecommendations, updateStatus } from "../../services/api";
import { AuthContext } from "../../auth/AuthContext";
import { getPlatformIcons } from "../../utils/platformIcons";
import "./SwipePage.css";

const STORAGE_JUEGOS = "swipe_deck_v3";
const STORAGE_INDICE = "swipe_index_v3";
const DRAG_THRESHOLD = 90;

export default function SwipePage() {
  const { user } = useContext(AuthContext);
  const [juegos, setJuegos] = useState<any[]>([]);
  const [idJuego, setIdJuego] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [mostrarInfo, setMostrarInfo] = useState(false);
  const [dragX, setDragX] = useState(0);
  const [flyOut, setFlyOut] = useState<"left" | "right" | null>(null);
  const [flyIn, setFlyIn] = useState(false);
  const [slidingIn, setSlidingIn] = useState(false);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const swipingRef = useRef(false);

  const cargarJuegos = async () => {
    const modo = localStorage.getItem('swipe_explore') === 'true';
    const deckGuardado = sessionStorage.getItem(STORAGE_JUEGOS);
    const indiceGuardado = sessionStorage.getItem(STORAGE_INDICE);
    if (deckGuardado) {
      const parsed = JSON.parse(deckGuardado);
      if (Array.isArray(parsed)) {
        setJuegos(parsed);
        setIdJuego(indiceGuardado ? Number(indiceGuardado) : 0);
        setCargando(false);
        return;
      }
      sessionStorage.removeItem(STORAGE_JUEGOS);
      sessionStorage.removeItem(STORAGE_INDICE);
    }
    try {
      const data = await getRecommendations(user.id, modo);
      if (!Array.isArray(data)) {
        console.error('Recomendaciones: respuesta inválida del servidor', data);
        setCargando(false);
        return;
      }
      console.log(`[SwipePage] Juegos cargados: ${data.length}`);
      sessionStorage.setItem(STORAGE_JUEGOS, JSON.stringify(data));
      sessionStorage.setItem(STORAGE_INDICE, "0");
      setJuegos(data);
    } catch (err) {
      console.error('Error cargando recomendaciones:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (user) cargarJuegos();
  }, [user?.id]);

  const triggerSwipe = async (direction: "left" | "right") => {
    if (swipingRef.current || !user) return;
    swipingRef.current = true;
    setFlyOut(direction);
    await new Promise((r) => setTimeout(r, 380));
    const juego = juegos[idJuego];
    if (!juego) { swipingRef.current = false; return; }
    await updateStatus(
      user.id,
      juego.id,
      direction === "right" ? "LIKED" : "DISLIKED",
    );
    const nuevoIndice = idJuego + 1;
    setIdJuego(nuevoIndice);
    sessionStorage.setItem(STORAGE_INDICE, String(nuevoIndice));
    setFlyOut(null);
    setDragX(0);
    swipingRef.current = false;
  };

  const handleRetroceder = () => {
    if (swipingRef.current || idJuego <= 0) return;
    const nuevoIndice = idJuego - 1;
    setFlyIn(true);
    setIdJuego(nuevoIndice);
    sessionStorage.setItem(STORAGE_INDICE, String(nuevoIndice));
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
    if (dragX > DRAG_THRESHOLD) {
      triggerSwipe("right");
    } else if (dragX < -DRAG_THRESHOLD) {
      triggerSwipe("left");
    } else {
      setDragX(0);
    }
  };

  useEffect(() => {
    if (cargando) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (mostrarInfo) { if (e.key === "Enter") setMostrarInfo(false); return; }
      switch (e.key) {
        case "ArrowLeft":
          triggerSwipe("left");
          break;
        case "ArrowRight":
          triggerSwipe("right");
          break;
        case "ArrowUp":
          e.preventDefault();
          setMostrarInfo(true);
          break;
        case "ArrowDown":
          e.preventDefault();
          handleRetroceder();
          break;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [cargando, mostrarInfo, idJuego, juegos, user]);

  if (cargando) {
    return (
      <div className="swipe-page page-enter">
        <div className="swipe-loading-container">
          <div className="swipe-loading-text">Loading recommendations...</div>
        </div>
      </div>
    );
  }

  if (juegos.length === 0) {
    return (
      <div className="swipe-page page-enter">
        <div className="swipe-loading-container">
          <div className="swipe-loading-text">Couldn't load recommendations</div>
          <button
            style={{ marginTop: 16, padding: '8px 20px', background: 'var(--cobalt)', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer' }}
            onClick={() => { sessionStorage.removeItem(STORAGE_JUEGOS); sessionStorage.removeItem(STORAGE_INDICE); cargarJuegos(); }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (juegos.length > 0 && idJuego >= juegos.length && !cargando) {
    sessionStorage.removeItem(STORAGE_JUEGOS);
    sessionStorage.removeItem(STORAGE_INDICE);
    setJuegos([]);
    setIdJuego(0);
    setCargando(true);
    cargarJuegos();
    return (
      <div className="swipe-page page-enter">
        <div className="swipe-loading-container">
          <div className="swipe-loading-text">Loading more games...</div>
        </div>
      </div>
    );
  }

  const juegoActual = juegos[idJuego];
  const puedeRetroceder = idJuego > 0;



  const progress = Math.min(Math.abs(dragX) / DRAG_THRESHOLD, 1);
  const rotation = flyOut ? (flyOut === "right" ? 20 : -20) : dragX * 0.07;
  const translateX = flyOut
    ? flyOut === "right"
      ? "150vw"
      : "-150vw"
    : flyIn
      ? "60vw"
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
  const showLike = dragX > 20 || flyOut === "right";
  const showNope = dragX < -20 || flyOut === "left";

  const juegoSiguiente = juegos[idJuego + 1];

  return (
    <div className="swipe-page page-enter">
      <GameInfoModal
        isOpen={mostrarInfo}
        onClose={() => setMostrarInfo(false)}
        game={juegoActual}
      />

      <div className="swipe-keyboard-hints">
        <div className="swipe-hint">
          <kbd>←</kbd>
          <span>Nope</span>
        </div>
        <div className="swipe-hint">
          <kbd>→</kbd>
          <span>Backlog</span>
        </div>
        <div className="swipe-hint">
          <kbd>↑</kbd>
          <span>Info</span>
        </div>
        <div className="swipe-hint">
          <kbd>↓</kbd>
          <span>Back</span>
        </div>
      </div>

      <div className="swipe-stack">
        {/* Glow dinámico del color del juego */}
        <div className="swipe-image-glow" key={juegoActual.id}>
          <img src={juegoActual.imageUrl} alt="" aria-hidden />
        </div>

        {/* Next card — always behind */}
        {juegoSiguiente && (
          <div className="swipe-card swipe-card-back">
            <div className="swipe-card-bg">
              <img
                src={juegoSiguiente.imageUrl}
                alt={juegoSiguiente.title}
                className="swipe-card-image"
              />
            </div>
            <div className="swipe-card-gradient" />
            <div className="swipe-card-info">
              <div className="swipe-card-title">{juegoSiguiente.title}</div>
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
            <img
              src={juegoActual.imageUrl}
              alt={juegoActual.title}
              className="swipe-card-image"
            />
          </div>
          <div className="swipe-card-gradient" />

          {/* Color overlay */}
          {showLike && (
            <div
              className="swipe-card-drag-overlay swipe-drag-like"
              style={{ opacity: overlayOpacity }}
            />
          )}
          {showNope && (
            <div
              className="swipe-card-drag-overlay swipe-drag-nope"
              style={{ opacity: overlayOpacity }}
            />
          )}

          {/* Stamps */}
          {showLike && (
            <div
              className="swipe-stamp swipe-stamp--like"
              style={{ opacity: stampOpacity }}
            >
              Backlog
            </div>
          )}
          {showNope && (
            <div
              className="swipe-stamp swipe-stamp--nope"
              style={{ opacity: stampOpacity }}
            >
              Nope
            </div>
          )}

          {/* Platform badges */}
          <div className="swipe-card-platforms">
            {getPlatformIcons(juegoActual.Platforms).map((icon, i) => (
              <div key={i} className="swipe-card-platform">
                <i className={icon} />
              </div>
            ))}
          </div>

          <div className="swipe-card-info">
            <div className="swipe-card-topmeta">
              {juegoActual.releaseYear && (
                <span className="swipe-tag">{juegoActual.releaseYear}</span>
              )}
              {juegoActual.playtime > 0 && (
                <span className="swipe-tag">~{juegoActual.playtime}h</span>
              )}
            </div>
            <div className="swipe-card-title">{juegoActual.title}</div>
            {(() => {
              const sub = juegoActual.developer
                ?? juegoActual.Genres?.slice(0, 2).map((g: any) => g.name).join(' · ')
                ?? null;
              return sub ? <div className="swipe-card-developer">{sub}</div> : null;
            })()}
          </div>
        </div>
      </div>

      <div className="swipe-actions">
        <button
          className="swipe-btn swipe-btn-back"
          onClick={handleRetroceder}
          disabled={!puedeRetroceder}
        >
          <i className="fa-solid fa-rotate-left"></i>
        </button>
        <button
          className="swipe-btn swipe-btn-pass"
          onClick={() => triggerSwipe("left")}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        <button
          className="swipe-btn swipe-btn-info"
          onClick={() => setMostrarInfo(true)}
        >
          <i className="fa-solid fa-info"></i>
        </button>
        <button
          className="swipe-btn swipe-btn-like"
          onClick={() => triggerSwipe("right")}
        >
          <i className="fa-solid fa-heart"></i>
        </button>
      </div>
    </div>
  );
}
