import './Paginador.css';

interface PaginadorProps {
    pagina: number;
    total: number;
    porPagina?: number;
    onChange: (p: number) => void;
}

export default function Paginador({ pagina, total, porPagina = 10, onChange }: PaginadorProps) {
    const totalPaginas = Math.ceil(total / porPagina);
    if (totalPaginas <= 1) return null;

    const getPages = (): (number | '...')[] => {
        if (totalPaginas <= 7) return Array.from({ length: totalPaginas }, (_, i) => i + 1);
        const pages: (number | '...')[] = [];
        const left = Math.max(2, pagina - 2);
        const right = Math.min(totalPaginas - 1, pagina + 2);
        pages.push(1);
        if (left > 2) pages.push('...');
        for (let i = left; i <= right; i++) pages.push(i);
        if (right < totalPaginas - 1) pages.push('...');
        pages.push(totalPaginas);
        return pages;
    };

    return (
        <div className="paginador">
            <button
                className="paginador-arrow"
                onClick={() => onChange(1)}
                disabled={pagina === 1}
                title="First page"
            >
                «
            </button>
            <button
                className="paginador-arrow"
                onClick={() => onChange(pagina - 1)}
                disabled={pagina === 1}
            >
                ‹
            </button>
            {getPages().map((p, i) =>
                p === '...'
                    ? <span key={`ellipsis-${i}`} className="paginador-ellipsis">…</span>
                    : <button
                        key={p}
                        className={`paginador-num${pagina === p ? ' paginador-num--active' : ''}`}
                        onClick={() => onChange(p as number)}
                      >
                        {p}
                      </button>
            )}
            <button
                className="paginador-arrow"
                onClick={() => onChange(pagina + 1)}
                disabled={pagina === totalPaginas}
            >
                ›
            </button>
            <button
                className="paginador-arrow"
                onClick={() => onChange(totalPaginas)}
                disabled={pagina === totalPaginas}
                title="Last page"
            >
                »
            </button>
        </div>
    );
}
