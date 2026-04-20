import { useState, useEffect } from 'react';
import {
    adminGetCollections, adminCreateCollection, adminUpdateCollection, adminDeleteCollection,
    adminGetCollectionGames, adminAddGameToCollection, adminRemoveGameFromCollection,
    adminGetGames,
} from '../../services/api';
import ConfirmModal from '../../components/ConfirmModal';

interface Collection {
    id: number;
    title: string;
    description: string | null;
    imageUrl: string | null;
}

interface Game {
    id: number;
    title: string;
    imageUrl: string | null;
    developer: string | null;
    releaseYear: number | null;
}

type ModalMode = 'create' | 'edit' | null;

export default function AdminColecciones() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [modal, setModal] = useState<ModalMode>(null);
    const [editing, setEditing] = useState<Collection | null>(null);
    const [form, setForm] = useState({ title: '', description: '', imageUrl: '' });
    const [saving, setSaving] = useState(false);
    const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);

    // Editor de juegos de colección
    const [selectedCol, setSelectedCol] = useState<Collection | null>(null);
    const [colGames, setColGames] = useState<Game[]>([]);
    const [allGames, setAllGames] = useState<Game[]>([]);
    const [gameSearch, setGameSearch] = useState('');
    const [visibleAddCount, setVisibleAddCount] = useState(20);

    const loadCollections = async () => {
        const data = await adminGetCollections();
        setCollections(data);
    };

    useEffect(() => { loadCollections(); }, []);

    useEffect(() => {
        if (!modal) return;
        const handleKey = (e: KeyboardEvent) => {
            const tag = (document.activeElement as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.key === 'Escape' || e.key === ' ') { e.preventDefault(); closeModal(); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [modal]);

    const openCreate = () => {
        setEditing(null);
        setForm({ title: '', description: '', imageUrl: '' });
        setModal('create');
    };

    const openEdit = (col: Collection) => {
        setEditing(col);
        setForm({ title: col.title, description: col.description ?? '', imageUrl: col.imageUrl ?? '' });
        setModal('edit');
    };

    const closeModal = () => { setModal(null); setEditing(null); };

    const handleSave = async () => {
        if (!form.title.trim()) return;
        setSaving(true);
        const payload = {
            title: form.title,
            description: form.description || null,
            imageUrl: form.imageUrl || null,
        };
        if (modal === 'create') {
            await adminCreateCollection(payload);
        } else if (editing) {
            await adminUpdateCollection(editing.id, payload);
        }
        setSaving(false);
        closeModal();
        loadCollections();
    };

    const handleDelete = (col: Collection) => {
        setConfirm({
            message: `¿Eliminar la colección "${col.title}"? Solo se eliminará la colección. Los juegos no se verán afectados.`,
            onConfirm: async () => {
                setConfirm(null);
                await adminDeleteCollection(col.id);
                if (selectedCol?.id === col.id) setSelectedCol(null);
                loadCollections();
            },
        });
    };

    const openGameEditor = async (col: Collection) => {
        setSelectedCol(col);
        setGameSearch('');
        setVisibleAddCount(20);
        const [games, all] = await Promise.all([
            adminGetCollectionGames(col.id),
            adminGetGames(),
        ]);
        setColGames(games);
        setAllGames(all);
    };

    const handleAddGame = async (game: Game) => {
        if (!selectedCol) return;
        await adminAddGameToCollection(selectedCol.id, game.id);
        const updated = await adminGetCollectionGames(selectedCol.id);
        setColGames(updated);
    };

    const handleRemoveGame = (game: Game) => {
        if (!selectedCol) return;
        setConfirm({
            message: `¿Quitar "${game.title}" de la colección "${selectedCol.title}"?`,
            onConfirm: async () => {
                setConfirm(null);
                await adminRemoveGameFromCollection(selectedCol.id, game.id);
                setColGames(prev => prev.filter(g => g.id !== game.id));
            },
        });
    };

    const colGameIds = new Set(colGames.map(g => g.id));
    const availableGames = allGames.filter(g =>
        !colGameIds.has(g.id) &&
        g.title.toLowerCase().includes(gameSearch.toLowerCase())
    );

    return (
        <div>
            <div className="admin-page-title">Colecciones</div>
            <div className="admin-page-sub">{collections.length} colecciones</div>

            <div className="admin-toolbar">
                <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                    <i className="fa-solid fa-plus" /> Nueva colección
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: selectedCol ? '1fr 1fr' : '1fr', gap: 24 }}>
                {/* ── Lista de colecciones ── */}
                <div>
                    {collections.length === 0 ? (
                        <div className="admin-empty">No hay colecciones</div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Título</th>
                                        <th>Descripción</th>
                                        <th style={{ textAlign: 'right' }}>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {collections.map(col => (
                                        <tr key={col.id} className={selectedCol?.id === col.id ? 'admin-row-selected' : ''}>
                                            <td style={{ fontWeight: 600 }}>
                                                {col.imageUrl && (
                                                    <img src={col.imageUrl} className="admin-game-thumb" alt={col.title} style={{ marginRight: 10, verticalAlign: 'middle' }} />
                                                )}
                                                {col.title}
                                            </td>
                                            <td style={{ color: 'rgba(255,255,255,0.4)' }}>
                                                {col.description ? col.description.slice(0, 60) + (col.description.length > 60 ? '...' : '') : '—'}
                                            </td>
                                            <td>
                                                <div className="admin-table-actions">
                                                    <button
                                                        className="admin-icon-btn"
                                                        title="Gestionar juegos"
                                                        onClick={() => openGameEditor(col)}
                                                    >
                                                        <i className="fa-solid fa-list" />
                                                    </button>
                                                    <button
                                                        className="admin-icon-btn"
                                                        title="Editar"
                                                        onClick={() => openEdit(col)}
                                                    >
                                                        <i className="fa-solid fa-pen" />
                                                    </button>
                                                    <button
                                                        className="admin-icon-btn danger"
                                                        title="Eliminar"
                                                        onClick={() => handleDelete(col)}
                                                    >
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
                </div>

                {/* ── Editor de juegos de colección ── */}
                {selectedCol && (
                    <div className="admin-col-editor">
                        <div className="admin-col-editor-header">
                            <div>
                                <div style={{ fontWeight: 700, fontSize: 16 }}>{selectedCol.title}</div>
                                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{colGames.length} juegos en la colección</div>
                            </div>
                            <button className="admin-icon-btn" onClick={() => setSelectedCol(null)}>
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>

                        <div className="admin-col-section-box">
                            <div className="admin-col-section-label">En la colección</div>
                            <div className="admin-col-game-list">
                                {colGames.length === 0 ? (
                                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, padding: '4px 0' }}>Sin juegos aún</div>
                                ) : colGames.map(g => (
                                    <div key={g.id} className="admin-col-game-item">
                                        {g.imageUrl
                                            ? <img src={g.imageUrl} className="admin-game-thumb" alt={g.title} />
                                            : <div className="admin-game-thumb-placeholder">{g.title[0]}</div>
                                        }
                                        <span className="admin-col-game-title">{g.title}</span>
                                        <button
                                            className="admin-icon-btn danger"
                                            title="Quitar de colección"
                                            onClick={() => handleRemoveGame(g)}
                                        >
                                            <i className="fa-solid fa-minus" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="admin-col-section-box">
                            <div className="admin-col-section-label">Añadir juego</div>
                            <div className="admin-col-search">
                                <i className="fa-solid fa-magnifying-glass" style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }} />
                                <input
                                    placeholder="Buscar juego..."
                                    value={gameSearch}
                                    onChange={e => { setGameSearch(e.target.value); setVisibleAddCount(20); }}
                                />
                            </div>
                            <div className="admin-col-game-list">
                                {availableGames.slice(0, visibleAddCount).map(g => (
                                    <div key={g.id} className="admin-col-game-item">
                                        {g.imageUrl
                                            ? <img src={g.imageUrl} className="admin-game-thumb" alt={g.title} />
                                            : <div className="admin-game-thumb-placeholder">{g.title[0]}</div>
                                        }
                                        <span className="admin-col-game-title">{g.title}</span>
                                        <button
                                            className="admin-icon-btn"
                                            title="Añadir a colección"
                                            onClick={() => handleAddGame(g)}
                                        >
                                            <i className="fa-solid fa-plus" />
                                        </button>
                                    </div>
                                ))}
                                {availableGames.length === 0 && (
                                    <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, padding: '4px 0' }}>
                                        {gameSearch ? 'Sin resultados' : 'Todos los juegos ya están en la colección'}
                                    </div>
                                )}
                            </div>
                            {visibleAddCount < availableGames.length && (
                                <button
                                    className="admin-btn admin-btn-ghost"
                                    style={{ width: '100%', justifyContent: 'center', height: 52 }}
                                    onClick={() => setVisibleAddCount(v => v + 20)}
                                >
                                    <i className="fa-solid fa-chevron-down" /> Mostrar más ({availableGames.length - visibleAddCount} restantes)
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Modal crear/editar ── */}
            {modal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-title">
                            {modal === 'create' ? 'Nueva colección' : 'Editar colección'}
                        </div>
                        <div className="admin-form-group">
                            <label>Título *</label>
                            <input
                                value={form.title}
                                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                placeholder="Nombre de la colección"
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>Descripción</label>
                            <textarea
                                value={form.description}
                                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                placeholder="Descripción opcional..."
                            />
                        </div>
                        <div className="admin-form-group">
                            <label>URL de imagen</label>
                            <input
                                value={form.imageUrl}
                                onChange={e => setForm(f => ({ ...f, imageUrl: e.target.value }))}
                                placeholder="https://..."
                            />
                        </div>
                        {form.imageUrl && (
                            <img
                                src={form.imageUrl}
                                alt="preview"
                                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 8, marginBottom: 12 }}
                                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                            />
                        )}
                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Cancelar</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving || !form.title.trim()}>
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
