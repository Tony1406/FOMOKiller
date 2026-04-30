import { useState, useEffect, useRef } from 'react';
import { uploadImage } from '../../services/api';
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
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

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
            setFormData({ username: user.username || '', bio: user.bio || '', avatarUrl: user.avatarUrl || '' });
            setPreviewSrc(null);
            setUploading(false);
        }
    }, [user, isOpen]);

    if (!isOpen || !user) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setPreviewSrc(URL.createObjectURL(file));
        setUploading(true);
        const url = await uploadImage(file);
        setUploading(false);
        if (url) setFormData(prev => ({ ...prev, avatarUrl: url }));
    };

    const handleRandomAvatar = () => {
        const seed = AVATAR_SEEDS[Math.floor(Math.random() * AVATAR_SEEDS.length)];
        const url = `https://api.dicebear.com/9.x/avataaars/svg?seed=${seed}`;
        setPreviewSrc(null);
        setFormData(prev => ({ ...prev, avatarUrl: url }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const avatarSrc = previewSrc || formData.avatarUrl || `https://api.dicebear.com/9.x/avataaars/svg?seed=${user.username || 'Felix'}`;

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
                            <img src={avatarSrc} alt="Avatar" className="ep-avatar-img" />
                            {uploading && (
                                <div className="ep-avatar-uploading">
                                    <i className="fa-solid fa-spinner fa-spin" />
                                </div>
                            )}
                        </div>
                        <div className="ep-avatar-fields">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                            />
                            <button
                                type="button"
                                className="ep-upload-btn"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={uploading}
                            >
                                <i className="fa-solid fa-upload" />
                                {uploading ? 'Uploading...' : 'Upload photo'}
                            </button>
                            <button type="button" className="ep-random-btn" onClick={handleRandomAvatar} disabled={uploading}>
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
                        <button type="submit" className="ep-btn-save" disabled={uploading}>Save changes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
