import './Top5Page.css';

export default function Top5Page() {
    return (
        <div className="page page-padded page-enter">
            <div className="top5-header">
                <div className="top5-title"> Top 5 Prioridades</div>
                <div className="top5-subtitle">Tus juegos más importantes ahora mismo</div>
            </div>

            <div className="top5-rule-box">
                <span className="top5-rule-text">
                    Solo puedes tener 5 juegos en prioridad. Para añadir uno nuevo, debes terminar o eliminar otro.
                </span>
            </div>

            <div className="top5-status-bar">
                <span className="top5-status-text">2 de 5 slots ocupados</span>
                <div className="top5-dots-container">
                    <div className="top5-dot-active" />
                    <div className="top5-dot-active" />
                    <div className="top5-dot-inactive" />
                    <div className="top5-dot-inactive" />
                    <div className="top5-dot-inactive" />
                </div>
            </div>

            <div className="priority-slots">
                <div className="priority-slot">
                    <div className="priority-num priority-num-1">1</div>
                    <div className="game-thumb-placeholder">E</div>
                    <div className="game-info">
                        <div className="game-title">Elden Ring</div>
                        <div className="game-subtitle">RPG</div>
                    </div>
                    <div className="top5-actions">
                        <button className="top5-btn top5-btn-drop"><i className="fa-solid fa-times"></i></button>
                        <button className="top5-btn top5-btn-complete"><i className="fa-solid fa-check"></i></button>
                    </div>
                </div>
                <div className="priority-slot">
                    <div className="priority-num priority-num-2">2</div>
                    <div className="game-thumb-placeholder">H</div>
                    <div className="game-info">
                        <div className="game-title">Hades II</div>
                        <div className="game-subtitle">Roguelike</div>
                    </div>
                    <div className="top5-actions">
                        <button className="top5-btn top5-btn-drop"><i className="fa-solid fa-times"></i></button>
                        <button className="top5-btn top5-btn-complete"><i className="fa-solid fa-check"></i></button>
                    </div>
                </div>
                <div className="priority-slot empty">
                    <div className="priority-num priority-num-4">3</div>
                    <div className="game-thumb-placeholder game-thumb-opacity"></div>
                    <span className="empty-slot-text">Slot disponible</span>
                </div>
                <div className="priority-slot empty">
                    <div className="priority-num priority-num-4">4</div>
                    <div className="game-thumb-placeholder game-thumb-opacity"></div>
                    <span className="empty-slot-text">Slot disponible</span>
                </div>
                <div className="priority-slot empty">
                    <div className="priority-num priority-num-5">5</div>
                    <div className="game-thumb-placeholder game-thumb-opacity"></div>
                    <span className="empty-slot-text">Slot disponible</span>
                </div>
            </div>


        </div>
    );
}
