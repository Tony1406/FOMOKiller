import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PrismaticBurst from '../../components/Background/PrismaticBurst';
import { useAuth } from '../../context/AuthContext';
import { savePreferences } from '../../services/api';
import logoSimple from '../../assets/Logo_simple.png';
import './OnboardingPage.css';

// ─── DATOS DE LAS PREGUNTAS ───────────────────────────────────────────────────

const PLATFORMS = [
    { id: 'PC', label: 'PC', icon: 'fa-solid fa-desktop' },
    { id: 'PlayStation 5', label: 'PS5', icon: 'fa-brands fa-playstation' },
    { id: 'PlayStation 4', label: 'PS4', icon: 'fa-brands fa-playstation' },
    { id: 'Xbox Series S/X', label: 'Xbox', icon: 'fa-brands fa-xbox' },
    { id: 'Nintendo Switch', label: 'Switch', icon: 'fa-solid fa-gamepad' },
    { id: 'iOS', label: 'iOS', icon: 'fa-brands fa-apple' },
    { id: 'Android', label: 'Android', icon: 'fa-brands fa-android' },
];

const STEPS = [
    {
        key: 'platforms',
        question: '¿En qué juegas?',
        subtitle: 'Puedes elegir varias.',
        type: 'multi',
        options: PLATFORMS,
    },
    {
        key: 'sessionLength',
        question: '¿Cómo son tus sesiones de juego normalmente?',
        subtitle: 'Elige la que mejor te describe.',
        type: 'single',
        options: [
            { id: 'short',  label: 'Ratitos sueltos cuando puedo',       icon: 'fa-solid fa-clock' },
            { id: 'medium', label: 'Tardes largas de fin de semana',      icon: 'fa-solid fa-mug-hot' },
            { id: 'long',   label: 'Me pierdo durante horas sin darme cuenta', icon: 'fa-solid fa-moon' },
        ],
    },
    {
        key: 'feeling',
        question: 'Cuando abres un juego, ¿qué buscas?',
        subtitle: 'Lo que te hace darle al botón de encendido.',
        type: 'single',
        options: [
            { id: 'tension',    label: 'Estar en tensión, al borde del asiento', icon: 'fa-solid fa-bolt' },
            { id: 'story',      label: 'Perderme en una historia que no olvidaré', icon: 'fa-solid fa-book-open' },
            { id: 'relax',      label: 'Relajarme, sin presión, en mi ritmo',    icon: 'fa-solid fa-leaf' },
            { id: 'adrenaline', label: 'Adrenalina disparada',                   icon: 'fa-solid fa-fire' },
            { id: 'build',      label: 'Construir algo desde cero',               icon: 'fa-solid fa-cubes' },
        ],
    },
    {
        key: 'worldType',
        question: '¿Qué tipo de mundo te atrae más?',
        subtitle: 'El universo en el que quieres perderte.',
        type: 'single',
        options: [
            { id: 'fantasy',   label: 'Fantasía épica y magia',              icon: 'fa-solid fa-hat-wizard' },
            { id: 'scifi',     label: 'Sci-fi y futuros distópicos',         icon: 'fa-solid fa-rocket' },
            { id: 'horror',    label: 'Terror y lo desconocido',             icon: 'fa-solid fa-skull' },
            { id: 'openworld', label: 'Mundos abiertos que explorar sin rumbo', icon: 'fa-solid fa-compass' },
            { id: 'realism',   label: 'Realismo, historia o deporte',        icon: 'fa-solid fa-trophy' },
        ],
    },
    {
        key: 'depth',
        question: 'Cuando un juego te engancha, ¿qué lo hace?',
        subtitle: 'Tu razón para seguir jugando.',
        type: 'single',
        options: [
            { id: 'casual',    label: 'Que sea fácil de coger y dejar',         icon: 'fa-solid fa-hand' },
            { id: 'complex',   label: 'Que tenga sistemas complejos para dominar', icon: 'fa-solid fa-brain' },
            { id: 'narrative', label: 'Que me cuente algo que me haga pensar',  icon: 'fa-solid fa-comment-dots' },
            { id: 'challenge', label: 'Que me ponga a prueba constantemente',   icon: 'fa-solid fa-shield-halved' },
        ],
    },
    {
        key: 'yearRange',
        question: '¿De qué época quieres jugar?',
        subtitle: 'Puedes no poner límite si te da igual la edad del juego.',
        type: 'yearRange',
        options: [],
    },
];

// ─── COMPONENTE ───────────────────────────────────────────────────────────────

const MIN_YEAR = 1980;
const MAX_YEAR = new Date().getFullYear();

export default function OnboardingPage() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [step, setStep] = useState(0);
    const [answers, setAnswers] = useState<Record<string, any>>({
        platforms: [] as string[],
        sessionLength: '',
        feeling: '',
        worldType: '',
        depth: '',
    });
    const [yearFilter, setYearFilter] = useState({ enabled: false, min: 2000, max: MAX_YEAR });
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Guardando tus preferencias...');

    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    const togglePlatform = (id: string) => {
        setAnswers(prev => {
            const list: string[] = prev.platforms;
            return {
                ...prev,
                platforms: list.includes(id) ? list.filter(p => p !== id) : [...list, id],
            };
        });
    };

    const selectSingle = (key: string, id: string) => {
        setAnswers(prev => ({ ...prev, [key]: id }));
    };

    const canContinue = () => {
        if (current.type === 'multi') return (answers.platforms as string[]).length > 0;
        if (current.type === 'yearRange') return true;
        return !!answers[current.key];
    };

    const handleNext = async () => {
        if (!canContinue()) return;
        if (!isLast) { setStep(s => s + 1); return; }

        // Último paso → guardar y animar
        setLoading(true);
        const payload = {
            ...answers,
            minYear: yearFilter.enabled ? yearFilter.min : null,
            maxYear: yearFilter.enabled ? yearFilter.max : null,
        };
        await savePreferences(user!.id, payload);
        sessionStorage.removeItem('swipe_deck_v2');
        sessionStorage.removeItem('swipe_index_v2');

        const messages = [
            'Guardando tus preferencias...',
            'Analizando tus gustos...',
            'Construyendo tu perfil...',
            'Casi listo...',
        ];
        let i = 0;
        const interval = setInterval(() => {
            i++;
            if (i < messages.length) setLoadingText(messages[i]);
            else clearInterval(interval);
        }, 900);

        setTimeout(() => {
            clearInterval(interval);
            navigate('/app/swipe');
        }, 3800);
    };

    // ── Pantalla de carga ──
    if (loading) {
        return (
            <div className="onboarding-root">
                <div className="ps2-bg">
                    <div className="land-aurora-bg">
                        <PrismaticBurst intensity={5} speed={0.5} animationType="rotate3d"
                            colors={['#5227FF', '#1000f5', '#10bff9']} distort={1} hoverDampness={0} rayCount={0} />
                    </div>
                    <div className="ps2-scanlines" />
                    <div className="ps2-vignette" />
                </div>
                <div className="onboarding-loading">
                    <img src={logoSimple} alt="FOMOKiller" className="onboarding-loading-logo" />
                    <div className="onboarding-loading-spinner" />
                    <p className="onboarding-loading-text">{loadingText}</p>
                </div>
            </div>
        );
    }

    // ── Wizard ──
    return (
        <div className="onboarding-root">
            {/* Fondo PS2 igual que el landing */}
            <div className="ps2-bg">
                <div className="land-aurora-bg">
                    <PrismaticBurst intensity={5} speed={0.5} animationType="rotate3d"
                        colors={['#5227FF', '#1000f5', '#10bff9']} distort={1} hoverDampness={0} rayCount={0} />
                </div>
                <div className="ps2-scanlines" />
                <div className="ps2-vignette" />
            </div>

            <div className="onboarding-container">
                {/* Logo */}
                <div className="onboarding-logo">
                    <img src={logoSimple} alt="FOMOKiller" className="onboarding-logo-img" />
                    <span className="onboarding-logo-text">FOMO<span className="onboarding-logo-accent">Killer</span></span>
                </div>

                {/* Barra de progreso */}
                <div className="onboarding-progress">
                    {STEPS.map((_, i) => (
                        <div key={i} className={`onboarding-progress-dot ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
                    ))}
                </div>
                <p className="onboarding-step-count">{step + 1} / {STEPS.length}</p>

                {/* Pregunta */}
                <div className="onboarding-card">
                    <h2 className="onboarding-question">{current.question}</h2>
                    <p className="onboarding-subtitle">{current.subtitle}</p>

                    {current.type === 'yearRange' ? (
                        <div className="year-range-ui">
                            <div className="year-era-btns">
                                <button
                                    className={`year-era-btn ${!yearFilter.enabled ? 'active' : ''}`}
                                    onClick={() => setYearFilter(f => ({ ...f, enabled: false }))}
                                >
                                    <i className="fa-solid fa-infinity" /> Cualquier época
                                </button>
                                <button
                                    className={`year-era-btn ${yearFilter.enabled ? 'active' : ''}`}
                                    onClick={() => setYearFilter(f => ({ ...f, enabled: true }))}
                                >
                                    <i className="fa-solid fa-calendar-days" /> Elegir rango
                                </button>
                            </div>

                            {yearFilter.enabled && (
                                <div className="year-sliders">
                                    <div className="year-slider-row">
                                        <span className="year-slider-label">Desde</span>
                                        <input
                                            type="range"
                                            className="year-slider"
                                            min={MIN_YEAR}
                                            max={MAX_YEAR - 1}
                                            value={yearFilter.min}
                                            onChange={e => {
                                                const val = Math.min(Number(e.target.value), yearFilter.max - 1);
                                                setYearFilter(f => ({ ...f, min: val }));
                                            }}
                                        />
                                        <span className="year-slider-value">{yearFilter.min}</span>
                                    </div>
                                    <div className="year-slider-row">
                                        <span className="year-slider-label">Hasta</span>
                                        <input
                                            type="range"
                                            className="year-slider"
                                            min={MIN_YEAR + 1}
                                            max={MAX_YEAR}
                                            value={yearFilter.max}
                                            onChange={e => {
                                                const val = Math.max(Number(e.target.value), yearFilter.min + 1);
                                                setYearFilter(f => ({ ...f, max: val }));
                                            }}
                                        />
                                        <span className="year-slider-value">{yearFilter.max}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={`onboarding-options ${current.type === 'multi' ? 'grid-multi' : 'grid-single'}`}>
                            {current.options.map(opt => {
                                const selected = current.type === 'multi'
                                    ? (answers.platforms as string[]).includes(opt.id)
                                    : answers[current.key] === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        className={`onboarding-option ${selected ? 'selected' : ''}`}
                                        onClick={() => current.type === 'multi'
                                            ? togglePlatform(opt.id)
                                            : selectSingle(current.key, opt.id)
                                        }
                                    >
                                        <i className={opt.icon} />
                                        <span>{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Navegación */}
                <div className="onboarding-nav">
                    {step > 0 && (
                        <button className="onboarding-btn-back" onClick={() => setStep(s => s - 1)}>
                            <i className="fa-solid fa-arrow-left" /> Atrás
                        </button>
                    )}
                    <button
                        className={`onboarding-btn-next ${!canContinue() ? 'disabled' : ''}`}
                        onClick={handleNext}
                        disabled={!canContinue()}
                    >
                        {isLast ? 'Empezar' : 'Siguiente'} <i className={`fa-solid ${isLast ? 'fa-rocket' : 'fa-arrow-right'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}
