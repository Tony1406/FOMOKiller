import { useState, useEffect, useContext, useRef } from "react";
import {
  getBacklog,
  updateStatus,
  markFinished,
  setPriority,
  clearBacklog,
} from "../../services/api";
import GameInfoModal from "../../components/modals/GameInfoModal";
import { AuthContext } from "../../context/AuthContext";
import "./BacklogPage.css";

export default function BacklogPage() {
  const { user } = useContext(AuthContext);
  const [backlog, setBacklog] = useState<any[]>([]);
  const [pestañaActiva, setPestañaActiva] = useState("Todos");
  const [busqueda, setBusqueda] = useState("");
  const [juegoSeleccionado, setJuegoSeleccionado] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [filtroOpen, setFiltroOpen] = useState(false);
  const [accionesOpen, setAccionesOpen] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [vista, setVista] = useState<"lista" | "cards">(
    () => (localStorage.getItem("fomo_vista_backlog") as "lista" | "cards") || "lista"
  );
  useEffect(() => { localStorage.setItem("fomo_vista_backlog", vista); }, [vista]);
  const filtroRef = useRef<HTMLDivElement>(null);
  const accionesRef = useRef<HTMLDivElement>(null);

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
      if (
        accionesRef.current &&
        !accionesRef.current.contains(e.target as Node)
      )
        setAccionesOpen(false);
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
      cargarBacklog();
    } catch (error) {
      console.error("Error actualizando estado:", error);
    }
  };

  const handleSetPriority = async (juego: any) => {
    if (!user) return;
    const newPriority = !juego.isPriority;
    try {
      const response = await setPriority(user.id, juego.gameId, newPriority);
      if (response.ok) {
        showToast(
          newPriority ? "Enviado a Top 5" : "Eliminado de Top 5",
          "success",
        );
        cargarBacklog();
      } else {
        const data = await response.json();
        showToast(
          response.status === 400
            ? "Ya tienes 5 juegos en Top 5"
            : data.error || "Error al cambiar prioridad",
          "error",
        );
      }
    } catch (error) {
      console.error("Error cambiando prioridad:", error);
      showToast("Error de conexión", "error");
    }
  };

  const handleClearBacklog = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    setConfirmClear(false);
    setAccionesOpen(false);
    if (!user) return;
    try {
      await clearBacklog(user.id);
      cargarBacklog();
      showToast("Backlog borrado", "success");
    } catch {
      showToast("Error al borrar el backlog", "error");
    }
  };

  const filteredGames = backlog.filter((juego) => {
    const filtroOk = pestañaActiva === "Todos" || juego.status === "COMPLETED";
    const busquedaOk =
      !busqueda ||
      juego.Game?.title?.toLowerCase().includes(busqueda.toLowerCase());
    return filtroOk && busquedaOk;
  });

  return (
    <div className="page page-padded page-enter">
      <div className="backlog-header">
        <div className="section-title">Mi Backlog</div>
        <div className="section-sub">{`${filteredGames.length} juegos en esta lista`}</div>

        <div className="backlog-toolbar">
          <div className="backlog-toolbar-left">
            {/* Filtrar */}
            <div className="backlog-dropdown-wrap" ref={filtroRef}>
              <button
                className={`backlog-dropdown-btn${pestañaActiva !== "Todos" ? " active" : ""}`}
                onClick={() => {
                  setFiltroOpen((o) => !o);
                  setAccionesOpen(false);
                }}
              >
                <i className="fa-solid fa-filter" />
                {pestañaActiva === "Todos" ? "Filtrar" : pestañaActiva}
                <i className="fa-solid fa-chevron-down backlog-chevron" />
              </button>
              {filtroOpen && (
                <div className="backlog-dropdown-menu">
                  {["Todos", "Completados"].map((opt) => (
                    <button
                      key={opt}
                      className={`backlog-dropdown-item${pestañaActiva === opt ? " active" : ""}`}
                      onClick={() => {
                        setPestañaActiva(opt);
                        setFiltroOpen(false);
                      }}
                    >
                      <i
                        className={`fa-solid fa-check backlog-item-check${pestañaActiva === opt ? " visible" : ""}`}
                      />
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Más acciones */}
            <div className="backlog-dropdown-wrap" ref={accionesRef}>
              <button
                className="backlog-dropdown-btn"
                onClick={() => {
                  setAccionesOpen((o) => !o);
                  setFiltroOpen(false);
                }}
              >
                <i className="fa-solid fa-ellipsis-vertical" />
                Más acciones
                <i className="fa-solid fa-chevron-down backlog-chevron" />
              </button>
              {accionesOpen && (
                <div className="backlog-dropdown-menu">
                  <button
                    className={`backlog-dropdown-item backlog-dropdown-item--danger${confirmClear ? " confirming" : ""}`}
                    onClick={handleClearBacklog}
                  >
                    <i className="fa-solid fa-trash" />
                    {confirmClear
                      ? "¿Seguro? Pulsa de nuevo"
                      : "Borrar todos los juegos"}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="backlog-legend">
            <div className="backlog-legend-item">
              <i className="fa-solid fa-info-circle" />
              <span>Mas informacion</span>
            </div>
            <div className="backlog-legend-item">
              <i className="fa-solid fa-ranking-star" />
              <span>Enviar a Top 5</span>
            </div>
            <div className="backlog-legend-item">
              <i className="fa-solid fa-trash" />
              <span>Eliminar de backlog</span>
            </div>
            <div className="backlog-legend-item">
              <i className="fa-solid fa-check" />
              <span>Marcar como Completado</span>
            </div>
          </div>

          <div className="backlog-toolbar-right">
            {/* Toggle vista */}
            <button
              className="backlog-view-btn"
              onClick={() =>
                setVista((v) => (v === "lista" ? "cards" : "lista"))
              }
              title={
                vista === "lista" ? "Ver como cuadrícula" : "Ver como lista"
              }
            >
              <i
                className={`fa-solid ${vista === "lista" ? "fa-grip" : "fa-list"}`}
              />
            </button>

            {/* Buscador */}
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
                <button
                  className="backlog-search-clear"
                  onClick={() => setBusqueda("")}
                >
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
            Todavía no has guardado ningún juego. Ve a descubrir y empieza a
            construir tu lista.
          </div>
        </div>
      )}
      {filteredGames.length === 0 && backlog.length > 0 && (
        <div className="backlog-empty">
          <div className="backlog-empty-title">Sin resultados</div>
          <div className="backlog-empty-sub">
            Ningún juego coincide con tu búsqueda o filtro.
          </div>
        </div>
      )}

      {/* Vista lista */}
      {vista === "lista" && filteredGames.length > 0 && (
        <div className="game-list">
          {filteredGames.map((juego: any) => {
            const game = juego.Game;
            const letraInicial = game.title[0].toUpperCase();
            return (
              <div key={juego.gameId} className="game-list-item">
                <div className="game-thumb-placeholder game-thumb-letter">
                  {letraInicial}
                </div>
                <div className="game-info">
                  <div className="game-title">{game?.title}</div>
                  <div className="game-subtitle">
                    {game?.developer} · {game?.releaseYear}
                  </div>
                </div>
                <div className="game-actions">
                  <button
                    className="action-btn-info"
                    onClick={() => setJuegoSeleccionado(game)}
                  >
                    <i className="fa-solid fa-info-circle"></i>
                  </button>
                  <button
                    className={`action-btn-secondary${juego.isPriority ? " action-btn-star--active" : ""}`}
                    onClick={() => handleSetPriority(juego)}
                    title={
                      juego.isPriority ? "Quitar de Top 5" : "Añadir a Top 5"
                    }
                  >
                    <i className="fa-solid fa-ranking-star"></i>
                  </button>
                  <button
                    className="action-btn-drop"
                    onClick={() => handleUpdateStatus(juego.gameId, "DROPPED")}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                  <button
                    className={
                      juego.status === "COMPLETED"
                        ? "action-btn-completado active"
                        : "action-btn-completado"
                    }
                    disabled={juego.isPriority}
                    onClick={() =>
                      handleUpdateStatus(
                        juego.gameId,
                        juego.status === "COMPLETED" ? "LIKED" : "COMPLETED",
                      )
                    }
                  >
                    <i className="fa-solid fa-check"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Vista cards */}
      {vista === "cards" && filteredGames.length > 0 && (
        <div className="game-grid">
          {filteredGames.map((juego: any) => {
            const game = juego.Game;
            return (
              <div key={juego.gameId} className="game-card">
                <div className="game-card-img-wrap">
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="game-card-image"
                    />
                  ) : (
                    <div className="game-card-no-image">
                      {game.title[0].toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="game-card-gradient" />
                <div className="game-card-info">
                  <div className="game-card-title">{game.title}</div>
                  <div className="game-card-subtitle">
                    {game.developer} · {game.releaseYear}
                  </div>
                  <div className="game-card-actions">
                    <button
                      className="action-btn-info"
                      onClick={() => setJuegoSeleccionado(game)}
                    >
                      <i className="fa-solid fa-info-circle"></i>
                    </button>
                    <button
                      className={`action-btn-secondary${juego.isPriority ? " action-btn-star--active" : ""}`}
                      onClick={() => handleSetPriority(juego)}
                      title={
                        juego.isPriority ? "Quitar de Top 5" : "Añadir a Top 5"
                      }
                    >
                      <i className="fa-solid fa-ranking-star"></i>
                    </button>
                    <button
                      className="action-btn-drop"
                      onClick={() =>
                        handleUpdateStatus(juego.gameId, "DROPPED")
                      }
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                    <button
                      className={
                        juego.status === "COMPLETED"
                          ? "action-btn-completado active"
                          : "action-btn-completado"
                      }
                      disabled={juego.isPriority}
                      onClick={() =>
                        handleUpdateStatus(
                          juego.gameId,
                          juego.status === "COMPLETED" ? "LIKED" : "COMPLETED",
                        )
                      }
                    >
                      <i className="fa-solid fa-check"></i>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GameInfoModal
        isOpen={juegoSeleccionado != null}
        onClose={() => setJuegoSeleccionado(null)}
        game={juegoSeleccionado}
      />

      {toastMsg && (
        <div className="toast-container">
          <div
            className={`toast ${toastType === "error" ? "toast-error" : ""}`}
          >
            {toastMsg}
          </div>
        </div>
      )}
    </div>
  );
}
