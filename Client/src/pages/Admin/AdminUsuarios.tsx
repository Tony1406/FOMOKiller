import { useState, useEffect } from 'react';
import { adminGetUsers, adminCreateUser, adminUpdateUser, adminDeleteUser } from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

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

    const load = async () => {
        setLoading(true);
        const data = await adminGetUsers();
        setUsers(data);
        setLoading(false);
    };

    useEffect(() => { load(); }, []);

    const openCreate = () => {
        setEditing(null);
        setForm(emptyForm);
        setFormError(null);
        setShowPassword(false);
        setModal('create');
    };

    const openEdit = (user: User) => {
        setEditing(user);
        setForm({ username: user.username, email: user.email, password: '', role: user.role, bio: user.bio ?? '', avatarUrl: user.avatarUrl ?? '' });
        setFormError(null);
        setShowPassword(false);
        setModal('edit');
    };

    const closeModal = () => { setModal(null); setEditing(null); setFormError(null); };

    const handleSave = async () => {
        if (!form.username.trim() || !form.email.trim()) { setFormError('Usuario y email son obligatorios'); return; }
        if (modal === 'create' && !form.password.trim()) { setFormError('La contraseña es obligatoria'); return; }
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
            message: `¿Eliminar usuario "${user.username}"? Esta acción no se puede deshacer.`,
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
            <div className="admin-page-title">Usuarios</div>
            <div className="admin-page-sub">{users.length} usuarios registrados</div>

            <div className="admin-toolbar">
                <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                    <i className="fa-solid fa-plus" /> Nuevo usuario
                </button>
                <div className="admin-search">
                    <i className="fa-solid fa-magnifying-glass" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }} />
                    <input
                        placeholder="Buscar por nombre o email..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="admin-empty">Cargando...</div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty">No hay usuarios</div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Usuario</th>
                                <th>Email</th>
                                <th>Rol</th>
                                <th>Registrado</th>
                                <th style={{ textAlign: 'right' }}>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(user => (
                                <tr key={user.id}>
                                    <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>{user.id}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            {user.avatarUrl ? (
                                                <img
                                                    src={user.avatarUrl}
                                                    alt=""
                                                    style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}
                                                />
                                            ) : (
                                                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px dashed rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                                                    <i className="fa-solid fa-user" />
                                                </div>
                                            )}
                                            <span style={{ fontWeight: 600 }}>{user.username}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'rgba(255,255,255,0.5)' }}>{user.email}</td>
                                    <td>
                                        <span className={`admin-badge admin-badge-${user.role}`}>{user.role}</span>
                                    </td>
                                    <td style={{ color: 'rgba(255,255,255,0.4)' }}>
                                        {new Date(user.createdAt).toLocaleDateString('es-ES')}
                                    </td>
                                    <td>
                                        <div className="admin-table-actions">
                                            <button className="admin-icon-btn" title="Editar usuario" onClick={() => openEdit(user)}>
                                                <i className="fa-solid fa-pen" />
                                            </button>
                                            <button className="admin-icon-btn danger" title="Eliminar usuario" onClick={() => handleDelete(user)}>
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

            {/* ── Modal crear/editar ── */}
            {modal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-title">
                            {modal === 'create' ? 'Nuevo usuario' : `Editar — ${editing?.username}`}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
                            <div className="admin-form-group">
                                <label>Nombre de usuario *</label>
                                <input value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} placeholder="username" />
                            </div>
                            <div className="admin-form-group">
                                <label>Rol</label>
                                <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as 'admin' | 'user' }))}>
                                    <option value="user">user</option>
                                    <option value="admin">admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Email *</label>
                            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="email@ejemplo.com" />
                        </div>

                        <div className="admin-form-group">
                            <label>{modal === 'create' ? 'Contraseña *' : 'Nueva contraseña (dejar vacío para no cambiar)'}</label>
                            <div className="admin-password-wrap">
                                <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} placeholder="••••••••" />
                                <button type="button" className="admin-password-toggle" onClick={() => setShowPassword(v => !v)}>
                                    <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                                </button>
                            </div>
                        </div>

                        <div className="admin-form-group">
                            <label>Bio</label>
                            <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} placeholder="Descripción del usuario..." />
                        </div>

                        <div className="admin-form-group">
                            <label>URL de avatar</label>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <input
                                    style={{ flex: 1 }}
                                    value={form.avatarUrl}
                                    onChange={e => setForm(f => ({ ...f, avatarUrl: e.target.value }))}
                                    placeholder="https://..."
                                />
                                {form.avatarUrl ? (
                                    <img
                                        src={form.avatarUrl}
                                        alt="Preview"
                                        onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }}
                                        onLoad={e => { (e.target as HTMLImageElement).style.opacity = '1'; }}
                                        style={{
                                            width: 48, height: 48, borderRadius: '50%',
                                            objectFit: 'cover', flexShrink: 0,
                                            border: '2px solid var(--cobalt)',
                                            background: 'rgba(255,255,255,0.05)',
                                            transition: 'opacity 0.2s',
                                        }}
                                    />
                                ) : (
                                    <div style={{
                                        width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                                        border: '2px dashed rgba(255,255,255,0.15)',
                                        background: 'rgba(255,255,255,0.03)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: 'rgba(255,255,255,0.2)', fontSize: 18,
                                    }}>
                                        <i className="fa-solid fa-user" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {formError && (
                            <div className="admin-rawg-msg err" style={{ marginBottom: 8 }}>
                                <i className="fa-solid fa-xmark" /> {formError}
                            </div>
                        )}

                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Cancelar</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Guardando...' : 'Guardar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {confirm && (
                <ConfirmModal
                    message={confirm.message}
                    onConfirm={confirm.onConfirm}
                    onCancel={() => setConfirm(null)}
                />
            )}
        </div>
    );
}
