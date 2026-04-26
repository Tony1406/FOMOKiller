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

const AVATAR_SEEDS = ['Felix', 'Milo', 'Luna', 'Nova', 'Sage', 'Zara', 'Ash', 'Rex', 'Orion', 'Ivy'];

export default function EditProfileModal({ user, isOpen, onClose, onSave }: EditProfileModalProps) {
    const [formData, setFormData] = useState({ username: '', bio: '', avatarUrl: '' });
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        const handleKey = (e: KeyboardEvent) => {
            const tag = (document.activeElement as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.key === 'Escape' || e.key === ' ') { e.preventDefault(); onClose(); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (user && isOpen) {
            setFormData({
                username: user.username || '',
                bio: user.bio || '',
                avatarUrl: user.avatarUrl || '',
            });
            setImgError(false);
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'avatarUrl') setImgError(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const avatarSrc = !imgError && formData.avatarUrl
        ? formData.avatarUrl
        : `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username || 'Felix'}`;

    const handleRandomAvatar = () => {
        const seed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)];
        setFormData(prev => ({ ...prev, avatarUrl: `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}` }));
        setImgError(false);
    };

    return (
        <div className="ep-overlay" onClick={onClose}>
            <div className="edit-profile-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>✕</button>

                <div className="ep-header">
                    <h2 className="ep-title">Edit Profile</h2>
                    <p className="ep-subtitle">Update your public information</p>
                </div>

                <form onSubmit={handleSubmit} className="ep-form">

                    <div className="ep-avatar-section">
                        <div className="ep-avatar-wrap">
                            <img
                                src={avatarSrc}
                                alt="Avatar"
                                className="ep-avatar-img"
                                onError={() => setImgError(true)}
                            />
                        </div>
                        <div className="ep-avatar-fields">
                            <div className="ep-field">
                                <label htmlFor="avatarUrl">Photo URL</label>
                                <input
                                    type="text"
                                    id="avatarUrl"
                                    name="avatarUrl"
                                    value={formData.avatarUrl}
                                    onChange={handleChange}
                                    placeholder="https://..."
                                />
                            </div>
                            <button type="button" className="ep-random-btn" onClick={handleRandomAvatar}>
                                <i className="fa-solid fa-shuffle" /> Random avatar
                            </button>
                        </div>
                    </div>

                    <div className="ep-field">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            maxLength={30}
                        />
                    </div>

                    <div className="ep-field">
                        <label htmlFor="bio">About you</label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={3}
                            maxLength={150}
                            placeholder="Tell us something about you..."
                        />
                        <span className="ep-char-count">{formData.bio.length}/150</span>
                    </div>

                    <div className="ep-actions">
                        <button type="button" className="ep-btn-cancel" onClick={onClose}>Cancel</button>
                        <button type="submit" className="ep-btn-save">Save changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
