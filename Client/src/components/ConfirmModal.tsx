import { useEffect } from 'react';

interface ConfirmModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    danger?: boolean;
}

export default function ConfirmModal({ message, onConfirm, onCancel, danger = true }: ConfirmModalProps) {
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' || e.key === ' ') { e.preventDefault(); onCancel(); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [onCancel]);

    return (
        <div className="admin-modal-overlay" onClick={onCancel}>
            <div className="admin-modal" style={{ maxWidth: 380 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: danger ? 'rgba(244,67,54,0.12)' : 'rgba(0,112,243,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: danger ? '#f44336' : '#0070f3', fontSize: 16, flexShrink: 0
                    }}>
                        <i className={`fa-solid ${danger ? 'fa-triangle-exclamation' : 'fa-circle-info'}`} />
                    </div>
                    <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 1.5, margin: 0 }}>
                        {message}
                    </p>
                </div>
                <div className="admin-modal-actions" style={{ marginTop: 8 }}>
                    <button className="admin-btn admin-btn-ghost" onClick={onCancel}>Cancelar</button>
                    <button
                        className={`admin-btn ${danger ? 'admin-btn-danger' : 'admin-btn-primary'}`}
                        onClick={onConfirm}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
}
