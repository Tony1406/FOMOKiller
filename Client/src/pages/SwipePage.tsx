import './SwipePage.css';

export default function SwipePage() {
    return (
        <div className="swipe-page page-enter">
            {/* Card Stack */}
            <div className="swipe-stack">
                <div className="swipe-card swipe-card-behind2">
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #001a00 0%, #003300 40%, #006600 100%)' }} />
                    <div className="swipe-card-gradient" />
                </div>

                <div className="swipe-card swipe-card-behind">
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #0a0020 0%, #2d0060 40%, #6a00cc 100%)' }} />
                    <div className="swipe-card-gradient" />
                </div>

                <div className="swipe-card swipe-card-front">
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1a0a00 0%, #4a1500 40%, #8B2500 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 120 }}>
                        ⚔️
                    </div>
                    <div className="swipe-card-gradient" />
                    <div className="swipe-card-info">
                        <div className="swipe-card-title">Elden Ring</div>
                        <div className="swipe-card-tags">
                            <span className="badge badge-cobalt">RPG</span>
                            <span className="badge badge-cobalt">Action</span>
                        </div>
                        <div className="swipe-card-meta">
                            <span>2022</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="swipe-actions">
                <button className="swipe-btn swipe-btn-pass">✕</button>
                <button className="swipe-btn swipe-btn-info">ℹ️</button>
                <button className="swipe-btn swipe-btn-like">🔥</button>
            </div>
        </div>
    );
}
