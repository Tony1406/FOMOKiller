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
            {pagina > 1 && (
                <button className="paginador-btn" onClick={() => onChange(pagina - 1)}>
                    Anterior
                </button>
            )}
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
            {pagina < totalPaginas && (
                <button className="paginador-btn" onClick={() => onChange(pagina + 1)}>
                    Siguiente
                </button>
            )}
        </div>
    );
}
