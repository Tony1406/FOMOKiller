import { useState, useEffect, useRef } from 'react';
import { adminGetUsers, adminCreateUser, adminUpdateUser, adminDeleteUser, uploadImage } from '../../services/api';
import ConfirmModal from '../../components/modals/ConfirmModal';
import './AdminUsuarios.css';

interface User {
    id: number;
    username: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
    bio?: string | null;
    avatarUrl?: string | null;
}

type ModalMode = 'create' | 'edit' | null;

const emptyForm = { username: '', email: '', password: '', role: 'user' as 'admin' | 'user', bio: '', avatarUrl: '' };

export default function AdminUsuarios() {
    const [users, setUsers] = useState<User[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);

    const [modal, setModal] = useState<ModalMode>(null);
    const [editing, setEditing] = useState<User | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const avatarFileRef = useRef<HTMLInputElement>(null);

    const load = async () => {
        setLoading(true);
        const data = await adminGetUsers();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    useEffect(() => {
        if (!modal) return;
        const handleKey = (e: KeyboardEvent) => {
            const tag = (document.activeElement as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
            if (e.key === 'Escape' || e.key === ' ') { e.preventDefault(); closeModal(); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [modal]);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setFormError(null);
        setShowPassword(false);
        setAvatarPreview(null);
        setModal('create');
    };

    const openEdit = (user: User) => {
        setEditing(user);
        setForm({ username: user.username, email: user.email, password: '', role: user.role, bio: user.bio ?? '', avatarUrl: user.avatarUrl ?? '' });
        setFormError(null);
        setShowPassword(false);
        setAvatarPreview(null);
        setModal('edit');
    };

    const closeModal = () => { setModal(null); setEditing(null); setFormError(null); setAvatarPreview(null); };

    const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
        setUploadingAvatar(true);
        const url = await uploadImage(file);
        setUploadingAvatar(false);
        if (url) setForm(f => ({ ...f, avatarUrl: url }));
    };

    const handleSave = async () => {
        if (!form.username.trim() || !form.email.trim()) { setFormError('Username and email are required'); return; }
        if (modal === 'create' && !form.password.trim()) { setFormError('Password is required'); return; }
        setSaving(true);
        setFormError(null);
        try {
            const payload: any = { username: form.username, email: form.email, role: form.role, bio: form.bio || null, avatarUrl: form.avatarUrl || null };
            if (form.password) payload.password = form.password;
            if (modal === 'create') {
                await adminCreateUser(payload);
            } else if (editing) {
                await adminUpdateUser(editing.id, payload);
            }
            closeModal();
            load();
        } catch (e: any) {
            setFormError(e.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = (user: User) => {
        setConfirm({
            message: `Delete user "${user.username}"? This action cannot be undone.`,
            onConfirm: async () => {
                setConfirm(null);
                await adminDeleteUser(user.id);
                load();
            },
        });
    };

    const filtered = users.filter(u =>
        u.username.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div className="admin-page-title">Users</div>
            <div className="admin-page-sub">{users.length} registered users</div>

            <div className="admin-toolbar">
                <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                    <i className="fa-solid fa-plus" /> New user
                </button>
                <div className="admin-search">
                    <i className="fa-solid fa-magnifying-glass admin-search-icon" />
                    <input
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="admin-empty">Loading...</div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty">No users found</div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Registered</th>
                                <th className="admin-th-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => (
                                <tr key={user.id}>
                                    <td className="admin-col-id">{user.id}</td>
                                    <td>
                                        <div className="admin-user-cell">
                                            {user.avatarUrl ? (
                                                <img src={user.avatarUrl} alt="" className="admin-avatar" />
                                            ) : (
                                                <div className="admin-avatar-placeholder">
                                                    <i className="fa-solid fa-user" />
                                                </div>
                                            )}
                                            <span className="admin-td-bold">{user.username}</span>
                                        </div>
                                    </td>
                                    <td className="admin-td-dim">{user.email}</td>
                                    <td>
                                        <span className={`admin-badge admin-badge-${user.role}`}>{user.role}</span>
                                    </td>
                                    <td className="admin-td-muted">
                                        {new Date(user.createdAt).toLocaleDateString('en-US')}
                                    </td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-icon-btn" title="Edit user" onClick={() => openEdit(user)}>
                                                <i className="fa-solid fa-pen" />
                                            </button>
                                            <button className="admin-icon-btn danger" title="Delete user" onClick={() => handleDelete(user)}>
                                                <i className="fa-solid fa-trash" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {modal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal admin-modal--sm" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-title">
                            {modal === 'create' ? 'New user' : `Edit — ${editing?.username}`}
                        </div>

                        <div className="admin-modal-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-group">
                                    <label>Username *</label>
                                    <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="username" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Role</label>
                                    <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as 'admin' | 'user' }))}>
                                        <option value="user">user</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Email *</label>
                                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@example.com" />
                            </div>

                            <div className="admin-form-group">
                                <label>{modal === 'create' ? 'Password *' : 'New password (leave blank to keep current)'}</label>
                                <div className="admin-password-wrap">
                                    <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
                                    <button type="button" className="admin-password-toggle" onClick={() => setShowPassword(v => !v)}>
                                        <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                                    </button>
                                </div>
                            </div>

                            <div className="admin-form-group">
                                <label>Bio</label>
                                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="User bio..." />
                            </div>

                            <div className="admin-form-group">
                                <label>Avatar</label>
                                <div className="admin-avatar-row">
                                    <input
                                        ref={avatarFileRef}
                                        type="file"
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                        onChange={handleAvatarFileChange}
                                    />
                                    <button
                                        type="button"
                                        className="admin-btn admin-btn-ghost"
                                        onClick={() => avatarFileRef.current?.click()}
                                        disabled={uploadingAvatar}
                                    >
                                        <i className={`fa-solid ${uploadingAvatar ? 'fa-spinner fa-spin' : 'fa-upload'}`} />
                                        {uploadingAvatar ? 'Uploading...' : 'Upload photo'}
                                    </button>
                                    {(avatarPreview || form.avatarUrl) ? (
                                        <img
                                            src={avatarPreview || form.avatarUrl}
                                            alt="Preview"
                                            className="admin-avatar-preview"
                                        />
                                    ) : (
                                        <div className="admin-avatar-preview-empty">
                                            <i className="fa-solid fa-user" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {formError && (
                            <div className="admin-rawg-msg err admin-modal-error">
                                <i className="fa-solid fa-xmark" /> {formError}
                            </div>
                        )}

                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Cancel</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmModal
                isOpen={!!confirm}
                title={confirm?.message ?? ''}
                onConfirm={confirm?.onConfirm ?? (() => {})}
                onClose={() => setConfirm(null)}
                variant="danger"
            />
        </div>
    );
}
