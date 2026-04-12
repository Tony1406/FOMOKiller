import { useState, useEffect, useContext, useRef } from "react";
import {
  getPriorities,
  setPriority,
  markFinished,
  updateStatus,
  reorderPriorities,
} from "../../services/api";
import { AuthContext } from "../../context/AuthContext";
import "./Top5Page.css";

export default function Top5Page() {
  const { user } = useContext(AuthContext);
  const [priorities, setPriorities] = useState<any[]>([]);
  const [vista, setVista] = useState<"lista" | "cards">(
    () =>
      (localStorage.getItem("fomo_vista_top5") as "lista" | "cards") || "lista",
  );
  useEffect(() => {
    localStorage.setItem("fomo_vista_top5", vista);
  }, [vista]);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);

  const cargarPrioridades = async () => {
    if (!user) return;
    const data = await getPriorities(user.id);
    setPriorities(data);
  };

  useEffect(() => {
    if (user) cargarPrioridades();
  }, [user]);

  const handleRemovePriority = async (gameId: number) => {
    if (!user) return;
    try {
      await setPriority(user.id, gameId, false);
      cargarPrioridades();
    } catch (error) {
      console.error("Error quitando prioridad:", error);
    }
  };

  const handleComplete = async (gameId: number) => {
    if (!user) return;
    try {
      await updateStatus(user.id, gameId, "COMPLETED");
      await markFinished(user.id, gameId, true);
      await setPriority(user.id, gameId, false);
      cargarPrioridades();
    } catch (error) {
      console.error("Error completando juego:", error);
    }
  };

  const onDragStart = (index: number) => {
    dragIndexRef.current = index;
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const onDrop = (dropIndex: number) => {
    const fromIndex = dragIndexRef.current;
    if (fromIndex === null || fromIndex === dropIndex) {
      setDragOverIndex(null);
      return;
    }
    const newOrder = [...priorities];
    const [moved] = newOrder.splice(fromIndex, 1);
    newOrder.splice(dropIndex, 0, moved);
    setPriorities(newOrder);
    setDragOverIndex(null);
    dragIndexRef.current = null;
    if (user) {
      reorderPriorities(
        user.id,
        newOrder.map((p, i) => ({ gameId: p.gameId, priorityOrder: i + 1 })),
      );
    }
  };

  const onDragEnd = () => {
    setDragOverIndex(null);
    dragIndexRef.current = null;
  };

  const slotCount = priorities.length;
  const emptySlots = 5 - slotCount;

  const numClass = (n: number) =>
    `priority-num-${n <= 3 ? n : n <= 4 ? "4" : "5"}`;

  return (
    <div className="page page-padded page-enter">
      <div className="top5-header">
        <div className="top5-title"> Top 5 Prioridades</div>
      </div>

      <div className="top5-rule-box">
        <span className="top5-rule-text">
          Solo puedes tener 5 juegos en prioridad. Para añadir uno nuevo, debes
          terminar o eliminar otro. Arrastra y suelta para reordenar tus
          prioridades
        </span>
      </div>

      <div className="top5-status-bar">
        <span className="top5-status-text">
          {slotCount} de 5 slots ocupados
        </span>
        <div className="top5-legend">
          <span className="top5-legend-item">
            <i className="fa-solid fa-times top5-legend-icon top5-legend-drop" />
            Dropear del Top 5
          </span>
          <span className="top5-legend-item">
            <i className="fa-solid fa-check top5-legend-icon top5-legend-done" />
            Marcar como Completado
          </span>
        </div>
        <div className="top5-status-right">
          <div className="top5-dots-container">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={
                  i < slotCount ? "top5-dot-active" : "top5-dot-inactive"
                }
              />
            ))}
          </div>
          <button
            className="backlog-view-btn"
            onClick={() => setVista((v) => (v === "lista" ? "cards" : "lista"))}
            title={vista === "lista" ? "Ver como cuadrícula" : "Ver como lista"}
          >
            <i
              className={`fa-solid ${vista === "lista" ? "fa-grip" : "fa-list"}`}
            />
          </button>
        </div>
      </div>

      {/* Vista lista */}
      {vista === "lista" && (
        <div className="priority-slots" key="lista">
          {priorities.map((juego: any, index: number) => {
            const game = juego.Game;
            const letraInicial = game.title[0].toUpperCase();
            return (
              <div
                key={juego.gameId}
                className={`priority-slot${dragOverIndex === index ? " drag-over" : ""}`}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDrop={() => onDrop(index)}
                onDragEnd={onDragEnd}
              >
                <i className="fa-solid fa-grip-lines top5-drag-handle" />
                <div className={`priority-num ${numClass(index + 1)}`}>
                  {index + 1}
                </div>
                {game.imageUrl
                  ? <img src={game.imageUrl} alt={game.title} className="game-thumb-img" />
                  : <div className="game-thumb-placeholder">{letraInicial}</div>
                }
                <div className="game-info">
                  <div className="game-title">{game.title}</div>
                  <div className="game-subtitle">
                    {[game.developer, game.releaseYear].filter(Boolean).join(' · ')}
                  </div>
                </div>
                <div className="game-actions">
                  <button
                    className="action-btn-drop"
                    onClick={() => handleRemovePriority(juego.gameId)}
                    title="Quitar de Top 5"
                  >
                    <i className="fa-solid fa-times" />
                  </button>
                  <button
                    className="action-btn-completado"
                    onClick={() => handleComplete(juego.gameId)}
                    title="Marcar como completado"
                  >
                    <i className="fa-solid fa-check" />
                  </button>
                </div>
              </div>
            );
          })}

          {Array.from({ length: emptySlots }).map((_, i) => {
            const slotNum = slotCount + i + 1;
            return (
              <div key={`empty-${i}`} className="priority-slot empty">
                <div className={`priority-num ${numClass(slotNum)}`}>
                  {slotNum}
                </div>
                <div className="game-thumb-placeholder game-thumb-opacity"></div>
                <span className="empty-slot-text">Slot disponible</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Vista cards */}
      {vista === "cards" && (
        <div className="top5-grid" key="cards">
          {priorities.map((juego: any, index: number) => {
            const game = juego.Game;
            return (
              <div
                key={juego.gameId}
                className={`top5-card${dragOverIndex === index ? " drag-over" : ""}`}
                draggable
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDrop={() => onDrop(index)}
                onDragEnd={onDragEnd}
              >
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
                <div className={`top5-card-badge ${numClass(index + 1)}`}>
                  {index + 1}
                </div>
                <div className="game-card-info">
                  <div className="game-card-title">{game.title}</div>
                  <div className="game-card-subtitle">
                    {[game.developer, game.releaseYear].filter(Boolean).join(' · ')}
                  </div>
                  <div className="top5-card-actions">
                    <button
                      className="action-btn-drop"
                      onClick={() => handleRemovePriority(juego.gameId)}
                      title="Quitar de Top 5"
                    >
                      <i className="fa-solid fa-times" />
                    </button>
                    <button
                      className="action-btn-completado"
                      onClick={() => handleComplete(juego.gameId)}
                      title="Marcar como completado"
                    >
                      <i className="fa-solid fa-check" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {Array.from({ length: emptySlots }).map((_, i) => {
            const slotNum = slotCount + i + 1;
            return (
              <div key={`empty-${i}`} className="top5-card top5-card-empty">
                <div className={`top5-card-badge ${numClass(slotNum)}`}>
                  {slotNum}
                </div>
                <div className="top5-card-empty-label">Slot disponible</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
