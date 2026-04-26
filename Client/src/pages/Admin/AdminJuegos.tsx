import { useState, useEffect, useRef } from 'react';
import {
    adminGetGames, adminDeleteGame, adminCreateGame, adminUpdateGame, adminGetPlatforms,
    adminSearchRawg, adminImportFromRawg,
} from '../../services/api';
import ConfirmModal from '../../components/modals/ConfirmModal';
import GameInfoModal from '../../components/modals/GameInfoModal';
import './AdminJuegos.css';

interface Game {
    id: number;
    title: string;
    developer: string | null;
    releaseYear?: number | null;
    imageUrl: string | null;
    rawgSlug: string | null;
    description?: string;
    playtime?: number;
    Genres?: { id: number; name: string }[];
    Platforms?: { id: number; name: string }[];
}

interface RawgResult {
    rawgId: number;
    rawgSlug: string;
    title: string;
    releaseYear: number | null;
    imageUrl: string | null;
    platforms: string[];
    genres: string[];
}

export default function AdminJuegos() {
    const [games, setGames] = useState<Game[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);
    const [visibleCount, setVisibleCount] = useState(20);
    const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);

    const emptyForm = { title: '', developer: '', releaseYear: '', imageUrl: '', trailerUrl: '', description: '' };
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [createForm, setCreateForm] = useState(emptyForm);
    const [createSaving, setCreateSaving] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);
    const [allPlatforms, setAllPlatforms] = useState<{ id: number; name: string }[]>([]);
    const [selectedPlatformIds, setSelectedPlatformIds] = useState<number[]>([]);
    const [platformsOpen, setPlatformsOpen] = useState(false);

    const [editingGame, setEditingGame] = useState<Game | null>(null);
    const [editForm, setEditForm] = useState(emptyForm);
    const [editPlatformIds, setEditPlatformIds] = useState<number[]>([]);
    const [editPlatformsOpen, setEditPlatformsOpen] = useState(false);
    const [editSaving, setEditSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    const openEdit = (game: Game) => {
        setEditingGame(game);
        setEditForm({
            title: game.title,
            developer: game.developer ?? '',
            releaseYear: game.releaseYear?.toString() ?? '',
            imageUrl: game.imageUrl ?? '',
            trailerUrl: '',
            description: game.description ?? '',
        });
        setEditPlatformIds((game.Platforms ?? []).map(p => p.id));
        setEditPlatformsOpen(false);
        setEditError(null);
    };

    const handleUpdateGame = async () => {
        if (!editingGame || !editForm.title.trim()) return;
        setEditSaving(true);
        setEditError(null);
        const payload: any = { title: editForm.title };
        if (editForm.developer) payload.developer = editForm.developer;
        if (editForm.releaseYear) payload.releaseYear = parseInt(editForm.releaseYear);
        if (editForm.imageUrl) payload.imageUrl = editForm.imageUrl;
        if (editForm.trailerUrl) payload.trailerUrl = editForm.trailerUrl;
        if (editForm.description) payload.description = editForm.description;
        payload.platformIds = editPlatformIds;
        const res = await adminUpdateGame(editingGame.id, payload);
        setEditSaving(false);
        if (res?.id) {
            setEditingGame(null);
            load();
        } else {
            setEditError(res?.error || 'Error updating game');
        }
    };

    const handleCreateGame = async () => {
        if (!createForm.title.trim()) { setCreateError('Title is required'); return; }
        setCreateSaving(true);
        setCreateError(null);
        const payload: any = { title: createForm.title };
        if (createForm.developer) payload.developer = createForm.developer;
        if (createForm.releaseYear) payload.releaseYear = parseInt(createForm.releaseYear);
        if (createForm.imageUrl) payload.imageUrl = createForm.imageUrl;
        if (createForm.trailerUrl) payload.trailerUrl = createForm.trailerUrl;
        if (createForm.description) payload.description = createForm.description;
        if (selectedPlatformIds.length > 0) payload.platformIds = selectedPlatformIds;
        const res = await adminCreateGame(payload);
        setCreateSaving(false);
        if (res?.id) {
            setShowCreateModal(false);
            setCreateForm(emptyForm);
            setSelectedPlatformIds([]);
            load();
        } else {
            setCreateError(res?.error || 'Error creating game');
        }
    };

    const [rawgQuery, setRawgQuery] = useState('');
    const [rawgResults, setRawgResults] = useState<RawgResult[]>([]);
    const [rawgPage, setRawgPage] = useState(1);
    const [rawgHasMore, setRawgHasMore] = useState(false);
    const [rawgSearching, setRawgSearching] = useState(false);
    const [rawgLoadingMore, setRawgLoadingMore] = useState(false);
    const [importing, setImporting] = useState<number | null>(null);
    const [importMsg, setImportMsg] = useState<{ text: string; ok: boolean } | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const load = async () => {
        setLoading(true);
        const data = await adminGetGames();
        setGames(data);
        setLoading(false);
    };

    useEffect(() => {
        load();
        adminGetPlatforms().then(setAllPlatforms);
    }, []);

    useEffect(() => {
        if (!editingGame) return;
        const handleKey = (e: KeyboardEvent) => {
            const tag = (document.activeElement as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.key === 'Escape' || e.key === ' ') { e.preventDefault(); setEditingGame(null); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [editingGame]);

    useEffect(() => {
        if (!showCreateModal) return;
        const handleKey = (e: KeyboardEvent) => {
            const tag = (document.activeElement as HTMLElement)?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.key === 'Escape' || e.key === ' ') { e.preventDefault(); setShowCreateModal(false); }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [showCreateModal]);

    const handleDelete = (game: Game) => {
        setConfirm({
            message: `Delete "${game.title}" from the database? This action cannot be undone.`,
            onConfirm: async () => {
                setConfirm(null);
                await adminDeleteGame(game.id);
                load();
            },
        });
    };

    useEffect(() => {
        if (!rawgQuery.trim()) { setRawgResults([]); setRawgHasMore(false); setRawgPage(1); return; }
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            setRawgSearching(true);
            setRawgPage(1);
            const data = await adminSearchRawg(rawgQuery, 1);
            setRawgResults(data.results ?? []);
            setRawgHasMore(data.hasMore ?? false);
            setRawgSearching(false);
        }, 500);
    }, [rawgQuery]);

    const handleLoadMore = async () => {
        const nextPage = rawgPage + 1;
        setRawgLoadingMore(true);
        const data = await adminSearchRawg(rawgQuery, nextPage);
        setRawgResults(prev => [...prev, ...(data.results ?? [])]);
        setRawgHasMore(data.hasMore ?? false);
        setRawgPage(nextPage);
        setRawgLoadingMore(false);
    };

    const handleImport = async (result: RawgResult) => {
        setImporting(result.rawgId);
        setImportMsg(null);
        try {
            await adminImportFromRawg(result.rawgSlug);
            setImportMsg({ text: `"${result.title}" imported successfully`, ok: true });
            load();
        } catch (e: any) {
            setImportMsg({ text: e.message || 'Import error', ok: false });
        } finally {
            setImporting(null);
        }
    };

    const filtered = games.filter(g =>
        g.title.toLowerCase().includes(search.toLowerCase()) ||
        (g.developer ?? '').toLowerCase().includes(search.toLowerCase())
    );
    const visibleGames = filtered.slice(0, visibleCount);

    return (
        <div>
            <div className="admin-page-title">Games</div>
            <div className="admin-page-sub">{games.length} games in the database</div>

            <div className="admin-rawg-panel">
                <div className="admin-rawg-panel-title">
                    <i className="fa-solid fa-cloud-arrow-down" />
                    Import from RAWG
                </div>
                <div className="admin-search admin-rawg-search">
                    <i className="fa-solid fa-magnifying-glass admin-search-icon" />
                    <input
                        placeholder="Search game in RAWG..."
                        value={rawgQuery}
                        onChange={e => setRawgQuery(e.target.value)}
                    />
                    {rawgSearching && <i className="fa-solid fa-spinner fa-spin admin-search-icon" />}
                </div>

                {importMsg && (
                    <div className={`admin-rawg-msg ${importMsg.ok ? 'ok' : 'err'}`}>
                        <i className={`fa-solid ${importMsg.ok ? 'fa-check' : 'fa-xmark'}`} />
                        {importMsg.text}
                    </div>
                )}

                {rawgResults.length > 0 && (
                    <>
                        <div className="admin-rawg-results">
                            {rawgResults.map(r => (
                                <div key={r.rawgId} className="admin-rawg-item">
                                    {r.imageUrl
                                        ? <img src={r.imageUrl} className="admin-game-thumb" alt={r.title} />
                                        : <div className="admin-game-thumb-placeholder">{r.title[0]}</div>
                                    }
                                    <div className="admin-rawg-item-info">
                                        <div className="admin-rawg-item-title">{r.title}</div>
                                        <div className="admin-rawg-item-sub">
                                            {r.releaseYear ?? '—'} · {r.genres.slice(0, 2).join(', ')}
                                        </div>
                                    </div>
                                    <button
                                        className="admin-btn admin-btn-primary admin-btn-import"
                                        disabled={importing === r.rawgId}
                                        onClick={() => handleImport(r)}
                                    >
                                        {importing === r.rawgId
                                            ? <i className="fa-solid fa-spinner fa-spin" />
                                            : <><i className="fa-solid fa-plus" /> Import</>
                                        }
                                    </button>
                                </div>
                            ))}
                        </div>
                        {rawgHasMore && (
                            <button
                                className="admin-btn admin-btn-ghost admin-btn-load-more"
                                onClick={handleLoadMore}
                                disabled={rawgLoadingMore}
                            >
                                {rawgLoadingMore
                                    ? <><i className="fa-solid fa-spinner fa-spin" /> Loading...</>
                                    : <><i className="fa-solid fa-chevron-down" /> Load more results</>
                                }
                            </button>
                        )}
                    </>
                )}
            </div>

            <div className="admin-toolbar admin-toolbar--mt">
                <button className="admin-btn admin-btn-primary" onClick={() => { setCreateForm(emptyForm); setCreateError(null); setSelectedPlatformIds([]); setShowCreateModal(true); }}>
                    <i className="fa-solid fa-plus" /> New game
                </button>
                <div className="admin-search">
                    <i className="fa-solid fa-magnifying-glass admin-search-icon" />
                    <input
                        placeholder="Filter games..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setVisibleCount(20); }}
                    />
                </div>
            </div>

            {loading ? (
                <div className="admin-empty">Loading...</div>
            ) : filtered.length === 0 ? (
                <div className="admin-empty">No games found</div>
            ) : (
                <div className="admin-table-wrap">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className="admin-th-img">Img</th>
                                <th>Title</th>
                                <th>Developer</th>
                                <th>Year</th>
                                <th>Platforms</th>
                                <th className="admin-th-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleGames.map(game => (
                                <tr key={game.id} className="admin-tr-clickable" onClick={() => setSelectedGame(game)}>
                                    <td>
                                        {game.imageUrl
                                            ? <img src={game.imageUrl} className="admin-game-thumb" alt={game.title} />
                                            : <div className="admin-game-thumb-placeholder">{game.title[0]}</div>
                                        }
                                    </td>
                                    <td className="admin-td-bold">{game.title}</td>
                                    <td className="admin-td-dim">{game.developer ?? '—'}</td>
                                    <td className="admin-td-muted">{game.releaseYear ?? '—'}</td>
                                    <td>
                                        <div className="admin-platforms">
                                            {game.Platforms && game.Platforms.length > 0
                                                ? game.Platforms.map(p => (
                                                    <span key={p.id} className="admin-platform-tag">{p.name}</span>
                                                ))
                                                : <span className="admin-no-platforms">—</span>
                                            }
                                        </div>
                                    </td>
                                    <td onClick={e => e.stopPropagation()}>
                                        <div className="admin-table-actions">
                                            <button className="admin-icon-btn" title="Edit game" onClick={() => openEdit(game)}>
                                                <i className="fa-solid fa-pen" />
                                            </button>
                                            <button className="admin-icon-btn danger" title="Delete game" onClick={() => handleDelete(game)}>
                                                <i className="fa-solid fa-trash" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {visibleCount < filtered.length && (
                        <button
                            className="admin-btn admin-btn-ghost admin-btn-full"
                            onClick={() => setVisibleCount(v => v + 20)}
                        >
                            <i className="fa-solid fa-chevron-down" /> Load more ({filtered.length - visibleCount} remaining)
                        </button>
                    )}
                </div>
            )}

            <ConfirmModal
                isOpen={!!confirm}
                title={confirm?.message ?? ''}
                onConfirm={confirm?.onConfirm ?? (() => {})}
                onClose={() => setConfirm(null)}
                variant="danger"
            />

            <GameInfoModal
                isOpen={selectedGame !== null}
                game={selectedGame}
                onClose={() => setSelectedGame(null)}
            />

            {editingGame && (
                <div className="admin-modal-overlay" onClick={() => setEditingGame(null)}>
                    <div className="admin-modal admin-modal--lg" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-title">Edit — {editingGame.title}</div>

                        <div className="admin-modal-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-group">
                                    <label>Title *</label>
                                    <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Developer</label>
                                    <input value={editForm.developer} onChange={e => setEditForm(f => ({ ...f, developer: e.target.value }))} placeholder="e.g. Capcom" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Release year</label>
                                    <input type="number" value={editForm.releaseYear} onChange={e => setEditForm(f => ({ ...f, releaseYear: e.target.value }))} />
                                </div>
                                <div className="admin-form-group">
                                    <label>Image URL</label>
                                    <input value={editForm.imageUrl} onChange={e => setEditForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
                                </div>
                                <div className="admin-form-group admin-form-full">
                                    <label>Trailer URL (YouTube embed)</label>
                                    <input value={editForm.trailerUrl} onChange={e => setEditForm(f => ({ ...f, trailerUrl: e.target.value }))} placeholder="https://www.youtube.com/embed/..." />
                                </div>
                                <div className="admin-form-group admin-form-full">
                                    <label>Description</label>
                                    <textarea value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} placeholder="Game description..." />
                                </div>
                            </div>

                            {editForm.imageUrl && (
                                <img src={editForm.imageUrl} alt="preview" className="admin-img-preview" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            )}

                            <div className="admin-form-group">
                                <button type="button" className="admin-platforms-toggle" onClick={() => setEditPlatformsOpen(o => !o)}>
                                    <span>Platforms{editPlatformIds.length > 0 ? ` (${editPlatformIds.length} selected)` : ''}</span>
                                    <i className={`fa-solid fa-chevron-${editPlatformsOpen ? 'up' : 'down'}`} />
                                </button>
                                {editPlatformsOpen && (
                                    <div className="admin-platforms-grid">
                                        {allPlatforms.map(p => {
                                            const active = editPlatformIds.includes(p.id);
                                            return (
                                                <button key={p.id} type="button"
                                                    className={`admin-platform-pick${active ? ' active' : ''}`}
                                                    onClick={() => setEditPlatformIds(prev =>
                                                        active ? prev.filter(id => id !== p.id) : [...prev, p.id]
                                                    )}
                                                >{p.name}</button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {editError && (
                            <div className="admin-rawg-msg err admin-modal-error">
                                <i className="fa-solid fa-xmark" /> {editError}
                            </div>
                        )}

                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setEditingGame(null)}>Cancel</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleUpdateGame} disabled={editSaving || !editForm.title.trim()}>
                                {editSaving ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showCreateModal && (
                <div className="admin-modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="admin-modal admin-modal--lg" onClick={e => e.stopPropagation()}>
                        <div className="admin-modal-title">New game</div>

                        <div className="admin-modal-body">
                            <div className="admin-form-grid">
                                <div className="admin-form-group">
                                    <label>Title *</label>
                                    <input value={createForm.title} onChange={e => setCreateForm(f => ({ ...f, title: e.target.value }))} placeholder="Game name" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Developer</label>
                                    <input value={createForm.developer} onChange={e => setCreateForm(f => ({ ...f, developer: e.target.value }))} placeholder="e.g. Capcom" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Release year</label>
                                    <input type="number" value={createForm.releaseYear} onChange={e => setCreateForm(f => ({ ...f, releaseYear: e.target.value }))} placeholder="e.g. 2024" />
                                </div>
                                <div className="admin-form-group">
                                    <label>Image URL</label>
                                    <input value={createForm.imageUrl} onChange={e => setCreateForm(f => ({ ...f, imageUrl: e.target.value }))} placeholder="https://..." />
                                </div>
                                <div className="admin-form-group admin-form-full">
                                    <label>Trailer URL (YouTube embed)</label>
                                    <input value={createForm.trailerUrl} onChange={e => setCreateForm(f => ({ ...f, trailerUrl: e.target.value }))} placeholder="https://www.youtube.com/embed/..." />
                                </div>
                                <div className="admin-form-group admin-form-full">
                                    <label>Description</label>
                                    <textarea value={createForm.description} onChange={e => setCreateForm(f => ({ ...f, description: e.target.value }))} placeholder="Game description..." />
                                </div>
                            </div>

                            {createForm.imageUrl && (
                                <img src={createForm.imageUrl} alt="preview" className="admin-img-preview" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                            )}

                            <div className="admin-form-group">
                                <button type="button" className="admin-platforms-toggle" onClick={() => setPlatformsOpen(o => !o)}>
                                    <span>Platforms{selectedPlatformIds.length > 0 ? ` (${selectedPlatformIds.length} selected)` : ''}</span>
                                    <i className={`fa-solid fa-chevron-${platformsOpen ? 'up' : 'down'}`} />
                                </button>
                                {platformsOpen && (
                                    <div className="admin-platforms-grid">
                                        {allPlatforms.map(p => {
                                            const active = selectedPlatformIds.includes(p.id);
                                            return (
                                                <button
                                                    key={p.id}
                                                    type="button"
                                                    className={`admin-platform-pick${active ? ' active' : ''}`}
                                                    onClick={() => setSelectedPlatformIds(prev =>
                                                        active ? prev.filter(id => id !== p.id) : [...prev, p.id]
                                                    )}
                                                >
                                                    {p.name}
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        </div>

                        {createError && (
                            <div className="admin-rawg-msg err admin-modal-error">
                                <i className="fa-solid fa-xmark" /> {createError}
                            </div>
                        )}

                        <div className="admin-modal-actions">
                            <button className="admin-btn admin-btn-ghost" onClick={() => setShowCreateModal(false)}>Cancel</button>
                            <button className="admin-btn admin-btn-primary" onClick={handleCreateGame} disabled={createSaving || !createForm.title.trim()}>
                                {createSaving ? 'Saving...' : 'Create game'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
