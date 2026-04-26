import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { savePreferences } from '../../services/api';
import logoSimple from '../../assets/Logo_simple.png';
import PrismaticBurst from '../../components/reactbits/PrismaticBurst';
import './OnboardingPage.css';

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
        question: 'What do you play on?',
        subtitle: 'You can choose multiple.',
        type: 'multi',
        options: PLATFORMS,
    },
    {
        key: 'sessionLength',
        question: 'What do your gaming sessions usually look like?',
        subtitle: 'Pick the one that best describes you.',
        type: 'single',
        options: [
            { id: 'short',  label: 'Short bursts whenever I can',       icon: 'fa-solid fa-clock' },
            { id: 'medium', label: 'Long weekend afternoons',           icon: 'fa-solid fa-mug-hot' },
            { id: 'long',   label: 'I lose track of time for hours',    icon: 'fa-solid fa-moon' },
            { id: 'any',    label: "Doesn't matter, I go with anything", icon: 'fa-solid fa-shuffle' },
        ],
    },
    {
        key: 'feeling',
        question: 'When you open a game, what are you looking for?',
        subtitle: 'What makes you hit that power button.',
        type: 'single',
        options: [
            { id: 'tension',    label: 'Tension, sitting on the edge of my seat', icon: 'fa-solid fa-bolt' },
            { id: 'story',      label: "Getting lost in a story I won't forget",  icon: 'fa-solid fa-book-open' },
            { id: 'relax',      label: 'Relaxing, no pressure, at my own pace',   icon: 'fa-solid fa-leaf' },
            { id: 'adrenaline', label: 'Pure adrenaline',                          icon: 'fa-solid fa-fire' },
            { id: 'build',      label: 'Building something from scratch',          icon: 'fa-solid fa-cubes' },
            { id: 'any',        label: "Doesn't matter, I go with anything",       icon: 'fa-solid fa-shuffle' },
        ],
    },
    {
        key: 'worldType',
        question: 'What kind of world appeals to you most?',
        subtitle: 'The universe you want to get lost in.',
        type: 'single',
        options: [
            { id: 'fantasy',   label: 'Epic fantasy and magic',              icon: 'fa-solid fa-hat-wizard' },
            { id: 'scifi',     label: 'Sci-fi and dystopian futures',        icon: 'fa-solid fa-rocket' },
            { id: 'horror',    label: 'Horror and the unknown',              icon: 'fa-solid fa-skull' },
            { id: 'openworld', label: 'Open worlds to explore without direction', icon: 'fa-solid fa-compass' },
            { id: 'realism',   label: 'Realism, history or sports',         icon: 'fa-solid fa-trophy' },
            { id: 'any',       label: "Doesn't matter, I go with anything", icon: 'fa-solid fa-shuffle' },
        ],
    },
    {
        key: 'depth',
        question: 'When a game hooks you, what does it?',
        subtitle: 'Your reason to keep playing.',
        type: 'single',
        options: [
            { id: 'casual',    label: 'Easy to pick up and put down',     icon: 'fa-solid fa-hand' },
            { id: 'complex',   label: 'Complex systems to master',        icon: 'fa-solid fa-brain' },
            { id: 'narrative', label: 'A story that makes me think',      icon: 'fa-solid fa-comment-dots' },
            { id: 'challenge', label: 'Constantly challenging me',        icon: 'fa-solid fa-shield-halved' },
            { id: 'any',       label: "Doesn't matter, I go with anything", icon: 'fa-solid fa-shuffle' },
        ],
    },
    {
        key: 'yearRange',
        question: 'What era do you want to play?',
        subtitle: "Leave it open if you don't care about the game's age.",
        type: 'yearRange',
        options: [],
    },
];

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
    const [loadingText, setLoadingText] = useState('Saving your preferences...');

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
            'Saving your preferences...',
            'Analyzing your taste...',
            'Building your profile...',
            'Almost done...',
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

    if (loading) {
        return (
            <div className="onboarding-root">
                <div className="onboarding-prismatic-bg">
                    <PrismaticBurst intensity={5} speed={0.5} animationType="rotate3d"
                        colors={['#5227FF', '#1000f5', '#10bff9']} distort={1} hoverDampness={0} rayCount={0} />
                </div>
                <div className="onboarding-loading">
                    <img src={logoSimple} alt="FOMOKiller" className="onboarding-loading-logo" />
                    <div className="onboarding-loading-spinner" />
                    <p className="onboarding-loading-text">{loadingText}</p>
                </div>
            </div>
        );
    }


    return (
        <div className="onboarding-root">
            <div className="onboarding-prismatic-bg">
                <PrismaticBurst intensity={5} speed={0.5} animationType="rotate3d"
                    colors={['#5227FF', '#1000f5', '#10bff9']} distort={1} hoverDampness={0} rayCount={0} />
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
                                    <i className="fa-solid fa-infinity" /> Any era
                                </button>
                                <button
                                    className={`year-era-btn ${yearFilter.enabled ? 'active' : ''}`}
                                    onClick={() => setYearFilter(f => ({ ...f, enabled: true }))}
                                >
                                    <i className="fa-solid fa-calendar-days" /> Choose range
                                </button>
                            </div>

                            {yearFilter.enabled && (
                                <div className="year-dual-range">
                                    <div className="year-dual-values">
                                        <span className="year-dual-val">{yearFilter.min}</span>
                                        <span className="year-dual-val">{yearFilter.max}</span>
                                    </div>
                                    <div className="year-dual-track-wrap">
                                        <div className="year-dual-track" />
                                        <div
                                            className="year-dual-fill"
                                            style={{
                                                left: `${(yearFilter.min - MIN_YEAR) / (MAX_YEAR - MIN_YEAR) * 100}%`,
                                                right: `${(MAX_YEAR - yearFilter.max) / (MAX_YEAR - MIN_YEAR) * 100}%`,
                                            }}
                                        />
                                        <input
                                            type="range"
                                            className="year-dual-input"
                                            min={MIN_YEAR}
                                            max={MAX_YEAR}
                                            value={yearFilter.min}
                                            onChange={e => {
                                                const val = Math.min(Number(e.target.value), yearFilter.max - 1);
                                                setYearFilter(f => ({ ...f, min: val }));
                                            }}
                                        />
                                        <input
                                            type="range"
                                            className="year-dual-input"
                                            min={MIN_YEAR}
                                            max={MAX_YEAR}
                                            value={yearFilter.max}
                                            onChange={e => {
                                                const val = Math.max(Number(e.target.value), yearFilter.min + 1);
                                                setYearFilter(f => ({ ...f, max: val }));
                                            }}
                                        />
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
                                        className={`onboarding-option ${selected ? 'selected' : ''} ${opt.id === 'any' ? 'any-option' : ''}`}
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
                            <i className="fa-solid fa-arrow-left" /> Back
                        </button>
                    )}
                    <button
                        className={`onboarding-btn-next ${!canContinue() ? 'disabled' : ''}`}
                        onClick={handleNext}
                        disabled={!canContinue()}
                    >
                        {isLast ? 'Start' : 'Next'} <i className={`fa-solid ${isLast ? 'fa-rocket' : 'fa-arrow-right'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
}
