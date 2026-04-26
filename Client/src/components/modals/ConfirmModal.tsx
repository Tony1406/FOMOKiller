import { useEffect } from 'react';
import './ConfirmModal.css';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description?: string;
    confirmLabel?: string;
    variant?: 'danger' | 'primary';
}

export default function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmLabel = 'Confirm',
    variant = 'primary',
}: ConfirmModalProps) {
    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' || e.key === ' ') { e.preventDefault(); onClose(); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="confirm-overlay" onClick={onClose}>
            <div className="modal-content confirm-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>
                <div className="confirm-modal-body">
                    <h2 className="confirm-modal-title">{title}</h2>
                    {description && <p className="confirm-modal-desc">{description}</p>}
                    <div className="confirm-modal-actions">
                        <button className="confirm-btn-cancel" onClick={onClose}>Cancel</button>
                        <button
                            className={variant === 'danger' ? 'confirm-btn-danger' : 'confirm-btn-primary'}
                            onClick={onConfirm}
                        >
                            {confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
