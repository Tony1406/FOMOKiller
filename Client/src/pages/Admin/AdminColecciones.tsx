import { useState, useEffect, useRef } from 'react';
import {
    adminGetCollections, adminCreateCollection, adminUpdateCollection, adminDeleteCollection,
    adminGetCollectionGames, adminAddGameToCollection, adminRemoveGameFromCollection,
    adminGetGames, uploadImage,
} from '../../services/api';
import ConfirmModal from '../../components/modals/ConfirmModal';
import './AdminColecciones.css';

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
    const [uploadingCol, setUploadingCol] = useState(false);
    const [colPreview, setColPreview] = useState<string | null>(null);
    const colFileInputRef = useRef<HTMLInputElement>(null);
    const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);

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
        setColPreview(null);
        setModal('create');
    };

    const openEdit = (col: Collection) => {
        setEditing(col);
        setForm({ title: col.title, description: col.description ?? '', imageUrl: col.imageUrl ?? '' });
        setColPreview(null);
        setModal('edit');
    };

    const closeModal = () => { setModal(null); setEditing(null); setColPreview(null); };

    const handleColFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setColPreview(URL.createObjectURL(file));
        setUploadingCol(true);
        const url = await uploadImage(file);
        setUploadingCol(false);
        if (url) setForm(f => ({ ...f, imageUrl: url }));
    };;

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
            message: `Delete collection "${col.title}"? Only the collection will be removed. Games will not be affected.`,
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

    const handleRemoveGame = async (game: Game) => {
        if (!selectedCol) return;
        await adminRemoveGameFromCollection(selectedCol.id, game.id);
        setColGames(prev => prev.filter(g => g.id !== game.id));
    };

    const colGameIds = new Set(colGames.map(g => g.id));
    const availableGames = allGames.filter(g =>
        !colGameIds.has(g.id) &&
        g.title.toLowerCase().includes(gameSearch.toLowerCase())
    );

    return (
        <div>
            <div className="admin-page-title">Collections</div>
            <div className="admin-page-sub">{collections.length} collections</div>

            <div className="admin-toolbar">
                <button className="admin-btn admin-btn-primary" onClick={openCreate}>
                    <i className="fa-solid fa-plus" /> New collection
                </button>
            </div>

            <div className={`admin-collections-layout${selectedCol ? ' admin-collections-layout--split' : ''}`}>
                <div>
                    {collections.length === 0 ? (
                        <div className="admin-empty">No collections found</div>
                    ) : (
                        <div className="admin-table-wrap">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th className="admin-th-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {collections.map(col => (
                                        <tr
                                            key={col.id}
                                            className={`admin-tr-clickable${selectedCol?.id === col.id ? ' admin-row-selected' : ''}`}
                                            onClick={() => openGameEditor(col)}
                                        >
                                            <td className="admin-td-bold">
                                                {col.imageUrl && (
                                                    <img src={col.imageUrl} className="admin-game-thumb admin-col-thumb" alt={col.title} />
                                                )}
                                                {col.title}
                                            </td>
                                            <td className="admin-td-muted">
                                                {col.description ? col.description.slice(0, 60) + (col.description.length > 60 ? '...' : '') : '—'}
                                            </td>
                                            <td onClick={e => e.stopPropagation()}>
                                                <div className="admin-table-actions">
                                                    <button className="admin-icon-btn" title="Edit" onClick={() => openEdit(col)}>
                                                        <i className="fa-solid fa-pen" />
                                                    </button>
                                                    <button className="admin-icon-btn danger" title="Delete" onClick={() => handleDelete(col)}>
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

                {selectedCol && (
                    <div className="admin-col-editor">
                        <div className="admin-col-editor-header">
                            <div>
                                <div className="admin-col-editor-name">{selectedCol.title}</div>
                                <div className="admin-col-editor-count">{colGames.length} games in collection</div>
                            </div>
                            <button className="admin-icon-btn" onClick={() => setSelectedCol(null)}>
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>

                        <div className="admin-col-section-box">
                            <div className="admin-col-section-label">In collection</div>
                            <div className="admin-col-game-list">
                                {colGames.length === 0 ? (
                                    <div className="admin-col-empty-text">No games yet</div>
                                ) : colGames.map(g => (
                                    <div key={g.id} className="admin-col-game-item">
                                        {g.imageUrl
                                            ? <img src={g.imageUrl} className="admin-game-thumb" alt={g.title} />
                                            : <div className="admin-game-thumb-placeholder">{g.title[0]}</div>
                                        }
                                        <span className="admin-col-game-title">{g.title}</span>
                                        <button className="admin-icon-btn danger" title="Remove from collection" onClick={() => handleRemoveGame(g)}>
                                            <i className="fa-solid fa-minus" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="admin-col-section-box">
                            <div className="admin-col-section-label">Add game</div>
                            <div className="admin-col-search">
                                <i className="fa-solid fa-magnifying-glass admin-search-icon" />
                                <input
                                    placeholder="Search game..."
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
                                        <button className="admin-icon-btn" title="Add to collection" onClick={() => handleAddGame(g)}>
                                            <i className="fa-solid fa-plus" />
                                        </button>
                                    </div>
                                ))}
                                {availableGames.length === 0 && (
                                    <div className="admin-col-empty-text">
                                        {gameSearch ? 'No results' : 'All games are already in this collection'}
                                    </div>
                                )}
                            </div>
                            {visibleAddCount < availableGames.length && (
                                <button
                                    className="admin-btn admin-btn-ghost admin-btn-load-more"
                                    onClick={() => setVisibleAddCount(v => v + 20)}
                                >
                                    <i className="fa-solid fa-chevron-down" /> Show more ({availableGames.length - visibleAddCount} remaining)
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {modal && (
                <div className="admin-modal-overlay" onClick={closeModal}>
                    <div className="admin-modal" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-title">
                            {modal === 'create' ? 'New collection' : 'Edit collection'}
                        </div>
                        <div className="admin-modal-body">
                            <div className="admin-form-group">
                                <label>Title *</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Collection name" />
                            </div>
                            <div className="admin-form-group">
                                <label>Description</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Optional description..." />
                            </div>
                            <div className="admin-form-group">
                                <label>Image</label>
                                <input
                                    ref={colFileInputRef}
                                    type="file"
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                    onChange={handleColFileChange}
                                />
                                <button
                                    type="button"
                                    className="admin-btn admin-btn-ghost"
                                    onClick={() => colFileInputRef.current?.click()}
                                    disabled={uploadingCol}
                                >
                                    <i className={`fa-solid ${uploadingCol ? 'fa-spinner fa-spin' : 'fa-upload'}`} />
                                    {uploadingCol ? 'Uploading...' : 'Upload image'}
                                </button>
                            </div>
                            {(colPreview || form.imageUrl) && (
                                <img
                                    src={colPreview || form.imageUrl}
                                    alt="preview"
                                    className="admin-img-preview"
                                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                            )}
                        </div>
                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-ghost" onClick={closeModal}>Cancel</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving || !form.title.trim()}>
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
