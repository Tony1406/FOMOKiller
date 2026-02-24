import { useState, useEffect } from 'react';
import './EditProfileModal.css';

interface User {
    username: string;
    bio: string;
    avatarUrl: string;
}

interface EditProfileModalProps {
    user: User | null;
    isOpen: boolean;
    onClose: () => void;
    onSave: (updatedData: Partial<User>) => void;
}

export default function EditProfileModal({ user, isOpen, onClose, onSave }: EditProfileModalProps) {
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        avatarUrl: ''
    });

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                username: user.username || '',
                bio: user.bio || '',
                avatarUrl: user.avatarUrl || ''
            });
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content profile-edit-modal" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                <div className="modal-header">
                    <h2>Editar Perfil</h2>
                    <p className="modal-subtitle">Actualiza tu información pública.</p>
                </div>

                <form onSubmit={handleSubmit} className="modal-body edit-profile-form">
                    <div className="form-group">
                        <label htmlFor="username">Nombre de usuario</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Tu nombre ninja..."
                            maxLength={30}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="avatarUrl">URL del Avatar</label>
                        <input
                            type="text"
                            id="avatarUrl"
                            name="avatarUrl"
                            value={formData.avatarUrl}
                            onChange={handleChange}
                            placeholder="https://ejemplo.com/mifoto.jpg"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bio">Biografía (Sobre ti)</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            placeholder="¡Cuéntanos a qué te gusta jugar!"
                            maxLength={150}
                        ></textarea>
                        <span className="char-count">{formData.bio.length}/150</span>
                    </div>

                    <div className="modal-actions-fixed">
                        <button type="button" className="action-btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="action-btn-completado">Guardar cambios</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
