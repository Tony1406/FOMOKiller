import { useState, useEffect, useContext, useRef } from "react";
import {
  getBacklog,
  updateStatus,
  markFinished,
  setPriority,
  clearBacklog,
} from "../../services/api";
import GameInfoModal from "../../components/modals/GameInfoModal";
import ConfirmModal from "../../components/modals/ConfirmModal";
import SwipeView from "../../components/SwipeView";
import Paginador from "../../components/Paginador";
import { AuthContext } from "../../context/AuthContext";
import "./BacklogPage.css";
import "../../components/Paginador.css";

type OrdenValue = "recientes" | "antiguos" | "az" | "za" | "año-asc" | "año-desc";
type VistaValue = "lista" | "cards" | "swipe";

const ORDEN_OPCIONES: { value: OrdenValue; label: string }[] = [
  { value: "recientes", label: "Recientes primero" },
  { value: "antiguos", label: "Antiguos primero" },
  { value: "az", label: "A–Z" },
  { value: "za", label: "Z–A" },
  { value: "año-asc", label: "Año ↑" },
  { value: "año-desc", label: "Año ↓" },
];

const FILTRO_OPCIONES = ["Todos", "Pendientes", "Completados", "Top 5"];

export default function BacklogPage() {
  const { user } = useContext(AuthContext);
  const [backlog, setBacklog] = useState<any[]>([]);
  const [pestañaActiva, setPestañaActiva] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [filtroOpen, setFiltroOpen] = useState(false);
  const [ordenActivo, setOrdenActivo] = useState<OrdenValue>("recientes");
  const [ordenOpen, setOrdenOpen] = useState(false);
  const [confirmDeleteGame, setConfirmDeleteGame] = useState<any>(null);
  const [confirmClearBacklog, setConfirmClearBacklog] = useState(false);
  const [vista, setVista] = useState<VistaValue>(
    () => {
      const v = localStorage.getItem("fomo_vista_backlog") as VistaValue;
      return (v === "lista" || v === "cards" || v === "swipe") ? v : "lista";
    }
  );
  const [swipeIndex, setSwipeIndex] = useState(0);
  const wasInSwipeRef = useRef(false);
  const prevVistaRef = useRef<"lista" | "cards">("lista");

  useEffect(() => { localStorage.setItem("fomo_vista_backlog", vista); }, [vista]);
  // When entering swipe, reset index; when leaving swipe, reload backlog
  useEffect(() => {
    if (vista === "swipe") {
      setSwipeIndex(0);
      wasInSwipeRef.current = true;
    } else if (wasInSwipeRef.current) {
      wasInSwipeRef.current = false;
      if (user) cargarBacklog();
    }
  }, [vista]);

  const [pagina, setPagina] = useState(1);
  useEffect(() => { setPagina(1); setSwipeIndex(0); }, [busqueda, pestañaActiva, ordenActivo]);
  const filtroRef = useRef<HTMLDivElement>(null);
  const ordenRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const scrollTop = () => pageRef.current?.scrollTo({ top: 0, behavior: 'smooth' });

  const cargarBacklog = async () => {
    if (!user) return;
    const data = await getBacklog(user.id);
    setBacklog(data);
  };

  useEffect(() => {
    if (user) cargarBacklog();
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filtroRef.current && !filtroRef.current.contains(e.target as Node))
        setFiltroOpen(false);
      if (ordenRef.current && !ordenRef.current.contains(e.target as Node))
        setOrdenOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setTimeout(() => setToastMsg(null), 2000);
  };

  const handleUpdateStatus = async (gameId: number, status: string) => {
    if (!user) return;
    try {
      await updateStatus(user.id, gameId, status);
      await markFinished(user.id, gameId, status === "COMPLETED");
      if (status === "COMPLETED") showToast("Juego marcado como completado");
      cargarBacklog();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const handleClearBacklogConfirmed = async () => {
    if (!user) return;
    setConfirmClearBacklog(false);
    try {
      await clearBacklog(user.id);
      cargarBacklog();
      showToast("Backlog vaciado");
    } catch {
      showToast("Error al vaciar el backlog", "error");
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!user || !confirmDeleteGame) return;
    const gameId = confirmDeleteGame.gameId;
    setConfirmDeleteGame(null);
    try {
      await updateStatus(user.id, gameId, "DROPPED");
      cargarBacklog();
      showToast("Juego eliminado del backlog");
    } catch {
      showToast("Error al eliminar el juego", "error");
    }
  };

  const handleSetPriority = async (juego: any) => {
    if (!user) return;
    const newPriority = !juego.isPriority;
    try {
      const response = await setPriority(user.id, juego.gameId, newPriority);
      if (response.ok) {
        showToast(newPriority ? "Enviado a Top 5" : "Eliminado de Top 5", "success");
        cargarBacklog();
      } else {
        const data = await response.json();
        showToast(
          response.status === 400 ? "Ya tienes 5 juegos en Top 5" : data.error || "Error al cambiar prioridad",
          "error",
        );
      }
    } catch (error) {
      console.error("Error cambiando prioridad:", error);
      showToast("Error de conexión", "error");
    }
  };

  const filteredGames = (() => {
    let games = backlog.filter((juego) => {
      const filtroOk =
        pestañaActiva === "Todos" ||
        (pestañaActiva === "Completados" && juego.status === "COMPLETED") ||
        (pestañaActiva === "Pendientes" && juego.status !== "COMPLETED") ||
        (pestañaActiva === "Top 5" && juego.isPriority === true);
      const busquedaOk =
        !busqueda ||
        juego.Game?.title?.toLowerCase().includes(busqueda.toLowerCase());
      return filtroOk && busquedaOk;
    });

    if (ordenActivo === "antiguos") {
      games = [...games].reverse();
    } else if (ordenActivo === "az") {
      games = [...games].sort((a, b) => a.Game.title.localeCompare(b.Game.title));
    } else if (ordenActivo === "za") {
      games = [...games].sort((a, b) => b.Game.title.localeCompare(a.Game.title));
    } else if (ordenActivo === "año-asc") {
      games = [...games].sort((a, b) => (a.Game.releaseYear || 0) - (b.Game.releaseYear || 0));
    } else if (ordenActivo === "año-desc") {
      games = [...games].sort((a, b) => (b.Game.releaseYear || 0) - (a.Game.releaseYear || 0));
    }

    return games;
  })();

  const ordenLabel = ORDEN_OPCIONES.find(o => o.value === ordenActivo)?.label ?? "Ordenar";

  const handleSetVista = (v: VistaValue) => {
    if (v === "swipe" && vista !== "swipe") prevVistaRef.current = vista as "lista" | "cards";
    setVista(v);
  };

  const viewToggle = (
    <div className="view-toggle-group">
      <button
        className={`view-toggle-btn${vista === "lista" ? " active" : ""}`}
        onClick={() => handleSetVista("lista")}
        title="Vista lista"
      >
        <i className="fa-solid fa-list" />
      </button>
      <button
        className={`view-toggle-btn${vista === "cards" ? " active" : ""}`}
        onClick={() => handleSetVista("cards")}
        title="Vista cuadrícula"
      >
        <i className="fa-solid fa-grip" />
      </button>
      <button
        className={`view-toggle-btn${vista === "swipe" ? " active" : ""}`}
        onClick={() => handleSetVista("swipe")}
        title="Vista swipe"
      >
        <i className="fa-solid fa-layer-group" />
      </button>
    </div>
  );

  // ── Swipe mode: full-height layout ──────────────
  if (vista === "swipe") {
    return (
      <div className="page page-enter page-swipe-mode">
        <div className="swipe-mode-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="back-btn-icon" onClick={() => setVista(prevVistaRef.current)} style={{ flexShrink: 0 }}>
              <i className="fa-solid fa-arrow-left" />
            </button>
            <div>
              <div className="section-title">Mi Backlog</div>
              <div className="section-sub">{filteredGames.length} juegos</div>
            </div>
          </div>
          {viewToggle}
        </div>

        {filteredGames.length > 0 ? (
          <SwipeView
            items={filteredGames}
            index={swipeIndex}
            onIndexChange={setSwipeIndex}
            getGame={(item) => ({
              id: item.Game.id,
              title: item.Game.title,
              imageUrl: item.Game.imageUrl,
              releaseYear: item.Game.releaseYear,
              developer: item.Game.developer,
              playtime: item.Game.playtime,
              rawgSlug: item.Game.rawgSlug,
              Platforms: item.Game.Platforms,
              Genres: item.Game.Genres,
            })}
            onLeft={async (item) => {
              if (!user) return;
              try {
                await updateStatus(user.id, item.gameId, "DROPPED");
                showToast("Juego eliminado del backlog");
              } catch {
                showToast("Error al eliminar", "error");
              }
            }}
            onRight={async () => { /* keep — no action needed */ }}
            onExtra={async (item) => {
              if (!user) return;
              const newPriority = !item.isPriority;
              try {
                const response = await setPriority(user.id, item.gameId, newPriority);
                if (response.ok) {
                  showToast(newPriority ? "Enviado a Top 5" : "Eliminado de Top 5");
                } else {
                  const data = await response.json();
                  showToast(
                    response.status === 400 ? "Ya tienes 5 juegos en Top 5" : data.error || "Error",
                    "error",
                  );
                }
              } catch {
                showToast("Error de conexión", "error");
              }
            }}
            leftLabel="Drop"
            rightLabel="Queda"
            extraLabel="Top 5"
            extraIcon="fa-solid fa-ranking-star"
            extraColor="#f5c518"
            doneMessage="Ya revisaste todo tu backlog"
          />
        ) : (
          <div className="swipe-view-done">
            <div className="swipe-view-done-text">
              {backlog.length === 0 ? "Tu backlog está vacío" : "Sin resultados con este filtro"}
            </div>
          </div>
        )}

        {toastMsg && (
          <div className="toast-container">
            <div className={`toast ${toastType === "error" ? "toast-error" : ""}`}>{toastMsg}</div>
          </div>
        )}
      </div>
    );
  }

  // ── Normal mode (lista / cards) ─────────────────
  return (
    <div className="page page-padded page-enter" ref={pageRef}>
      <div className="backlog-header">
        <div className="section-title">Mi Backlog</div>
        <div className="section-sub">{`${filteredGames.length} juegos en esta lista`}</div>

        <div className="backlog-toolbar">
          <div className="backlog-toolbar-left">
            {/* Filtrar */}
            <div className="backlog-dropdown-wrap" ref={filtroRef}>
              <button
                className={`backlog-dropdown-btn${pestañaActiva !== "Todos" ? " active" : ""}`}
                onClick={() => { setFiltroOpen((o) => !o); setOrdenOpen(false); }}
              >
                <i className="fa-solid fa-filter" />
                {pestañaActiva === "Todos" ? "Filtrar" : pestañaActiva}
                <i className="fa-solid fa-chevron-down backlog-chevron" />
              </button>
              {filtroOpen && (
                <div className="backlog-dropdown-menu">
                  {FILTRO_OPCIONES.map((opt) => (
                    <button
                      key={opt}
                      className={`backlog-dropdown-item${pestañaActiva === opt ? " active" : ""}`}
                      onClick={() => { setPestañaActiva(opt); setFiltroOpen(false); }}
                    >
                      <i className={`fa-solid fa-check backlog-item-check${pestañaActiva === opt ? " visible" : ""}`} />
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Ordenar */}
            <div className="backlog-dropdown-wrap" ref={ordenRef}>
              <button
                className={`backlog-dropdown-btn${ordenActivo !== "recientes" ? " active" : ""}`}
                onClick={() => { setOrdenOpen((o) => !o); setFiltroOpen(false); }}
              >
                <i className="fa-solid fa-arrow-up-wide-short" />
                {ordenActivo === "recientes" ? "Ordenar" : ordenLabel}
                <i className="fa-solid fa-chevron-down backlog-chevron" />
              </button>
              {ordenOpen && (
                <div className="backlog-dropdown-menu">
                  {ORDEN_OPCIONES.map((op) => (
                    <button
                      key={op.value}
                      className={`backlog-dropdown-item${ordenActivo === op.value ? " active" : ""}`}
                      onClick={() => { setOrdenActivo(op.value); setOrdenOpen(false); }}
                    >
                      <i className={`fa-solid fa-check backlog-item-check${ordenActivo === op.value ? " visible" : ""}`} />
                      {op.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="backlog-legend">
            <div className="backlog-legend-item"><i className="fa-solid fa-ranking-star" /><span>Enviar a Top 5</span></div>
            <div className="backlog-legend-item"><i className="fa-solid fa-trash" /><span>Eliminar de backlog</span></div>
            <div className="backlog-legend-item"><i className="fa-solid fa-check" /><span>Marcar como Completado</span></div>
          </div>

          <div className="backlog-toolbar-right">
            {backlog.length > 0 && (
              <button className="backlog-clear-btn" onClick={() => setConfirmClearBacklog(true)} title="Vaciar backlog">
                <i className="fa-solid fa-trash-can" />
                <span>Vaciar</span>
              </button>
            )}
            {viewToggle}
            <div className="backlog-search">
              <i className="fa-solid fa-magnifying-glass backlog-search-icon" />
              <input
                type="text"
                placeholder="Buscar juego..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="backlog-search-input"
              />
              {busqueda && (
                <button className="backlog-search-clear" onClick={() => setBusqueda("")}>
                  <i className="fa-solid fa-xmark" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Empty states */}
      {filteredGames.length === 0 && backlog.length === 0 && (
        <div className="backlog-empty">
          <div className="backlog-empty-title">Tu backlog está vacío</div>
          <div className="backlog-empty-sub">
            Todavía no has guardado ningún juego. Ve a descubrir y empieza a construir tu lista.
          </div>
        </div>
      )}
      {filteredGames.length === 0 && backlog.length > 0 && (
        <div className="backlog-empty">
          <div className="backlog-empty-title">Sin resultados</div>
          <div className="backlog-empty-sub">Ningún juego coincide con tu búsqueda o filtro.</div>
        </div>
      )}

      {/* Vista lista */}
      {vista === "lista" && filteredGames.length > 0 && (
        <>
          <div className="game-list" key="lista">
            {filteredGames.slice((pagina - 1) * 18, pagina * 18).map((juego: any) => {
              const game = juego.Game;
              const letraInicial = game.title[0].toUpperCase();
              return (
                <div key={juego.gameId} className="game-list-item" onClick={() => setJuegoSeleccionado(game)}>
                  {game.imageUrl
                    ? <img src={game.imageUrl} alt={game.title} className="game-thumb-img" />
                    : <div className="game-thumb-placeholder game-thumb-letter">{letraInicial}</div>
                  }
                  <div className="game-info">
                    <div className="game-title">{game?.title}</div>
                    <div className="game-subtitle">{[game?.developer, game?.releaseYear].filter(Boolean).join(' · ')}</div>
                  </div>
                  <div className="game-actions">
                    <button
                      className={juego.status === "COMPLETED" ? "action-btn-completado active" : "action-btn-completado"}
                      onClick={(e) => { e.stopPropagation(); handleUpdateStatus(juego.gameId, juego.status === "COMPLETED" ? "LIKED" : "COMPLETED"); }}
                      title={juego.status === "COMPLETED" ? "Desmarcar completado" : "Marcar como completado"}
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                    <button
                      className={`action-btn-secondary${juego.isPriority ? " action-btn-star--active" : ""}`}
                      onClick={(e) => { e.stopPropagation(); handleSetPriority(juego); }}
                      title={juego.isPriority ? "Quitar de Top 5" : "Añadir a Top 5"}
                    >
                      <i className="fa-solid fa-ranking-star"></i>
                    </button>
                    <button
                      className="action-btn-drop"
                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteGame(juego); }}
                      title="Eliminar del backlog"
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
          <Paginador
            pagina={pagina}
            total={filteredGames.length}
            porPagina={18}
            onChange={p => { setPagina(p); scrollTop(); }}
          />
        </>
      )}

      {/* Vista cards */}
      {vista === "cards" && filteredGames.length > 0 && (
        <>
          <div className="game-grid" key="cards">
            {filteredGames.slice((pagina - 1) * 18, pagina * 18).map((juego: any) => {
              const game = juego.Game;
              return (
                <div key={juego.gameId} className={`game-card${juego.status === "COMPLETED" ? " game-card--completed" : juego.isPriority ? " game-card--top5" : ""}`} onClick={() => setJuegoSeleccionado(game)}>
                  <div className="game-card-img-wrap">
                    {game.imageUrl ? (
                      <img src={game.imageUrl} alt={game.title} className="game-card-image" />
                    ) : (
                      <div className="game-card-no-image">{game.title[0].toUpperCase()}</div>
                    )}
                  </div>
                  {juego.isPriority && juego.status !== "COMPLETED" && (
                    <><div className="game-card-top5-overlay" /><div className="game-card-top5-stamp">TOP 5</div></>
                  )}
                  {juego.status === "COMPLETED" && (
                    <><div className="game-card-completed-overlay" /><div className="game-card-stamp">COMPLETADO</div></>
                  )}
                  <div className="game-card-gradient" />
                  <div className="game-card-info">
                    <div className="game-card-title">{game.title}</div>
                    <div className="game-card-subtitle">{[game.developer, game.releaseYear].filter(Boolean).join(' · ')}</div>
                    <div className="game-card-actions">
                      <button
                        className={juego.status === "COMPLETED" ? "action-btn-completado active" : "action-btn-completado"}
                        onClick={(e) => { e.stopPropagation(); handleUpdateStatus(juego.gameId, juego.status === "COMPLETED" ? "LIKED" : "COMPLETED"); }}
                        title={juego.status === "COMPLETED" ? "Desmarcar completado" : "Marcar como completado"}
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button
                        className={`action-btn-secondary${juego.isPriority ? " action-btn-star--active" : ""}`}
                        onClick={(e) => { e.stopPropagation(); handleSetPriority(juego); }}
                        title={juego.isPriority ? "Quitar de Top 5" : "Añadir a Top 5"}
                      >
                        <i className="fa-solid fa-ranking-star"></i>
                      </button>
                      <button
                        className="action-btn-drop"
                        onClick={(e) => { e.stopPropagation(); setConfirmDeleteGame(juego); }}
                        title="Eliminar del backlog"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <Paginador
            pagina={pagina}
            total={filteredGames.length}
            porPagina={18}
            onChange={p => { setPagina(p); scrollTop(); }}
          />
        </>
      )}

      <GameInfoModal
        isOpen={juegoSeleccionado != null}
        onClose={() => setJuegoSeleccionado(null)}
        game={juegoSeleccionado}
      />

      <ConfirmModal
        isOpen={confirmDeleteGame != null}
        onClose={() => setConfirmDeleteGame(null)}
        onConfirm={handleDeleteConfirmed}
        title="¿Eliminar del backlog?"
        description={`"${confirmDeleteGame?.Game?.title}" se quitará de tu backlog. Podrás volver a añadirlo desde Explorar.`}
        confirmLabel="Eliminar"
        variant="danger"
      />

      <ConfirmModal
        isOpen={confirmClearBacklog}
        onClose={() => setConfirmClearBacklog(false)}
        onConfirm={handleClearBacklogConfirmed}
        title="¿Vaciar el backlog?"
        description="Se eliminarán todos los juegos de tu backlog. Esta acción no se puede deshacer."
        confirmLabel="Vaciar todo"
        variant="danger"
      />

      {toastMsg && (
        <div className="toast-container">
          <div className={`toast ${toastType === "error" ? "toast-error" : ""}`}>{toastMsg}</div>
        </div>
      )}
    </div>
  );
}
