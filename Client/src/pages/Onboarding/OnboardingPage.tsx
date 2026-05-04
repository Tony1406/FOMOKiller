import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { savePreferences } from '../../services/api';
import logoSimple from '../../assets/Logo_simple.png';
import PrismaticBurst from '../../components/reactbits/PrismaticBurst';
import './OnboardingPage.css';

const PLATFORMS = [
    { id: 'PC',              label: 'PC',          icon: 'fa-solid fa-desktop' },
    { id: 'PlayStation',     label: 'PlayStation',  icon: 'fa-brands fa-playstation' },
    { id: 'Xbox Series S/X', label: 'Xbox',         icon: 'fa-brands fa-xbox' },
    { id: 'Nintendo Switch', label: 'Nintendo',     icon: 'fa-solid fa-gamepad' },
    { id: 'Mobile',          label: 'Mobile',       icon: 'fa-solid fa-mobile-screen' },
];

const GAME_TYPES = [
    { id: 'action',    label: 'Action / Combat' },
    { id: 'adventure', label: 'Adventure / Story' },
    { id: 'horror',    label: 'Horror / Survival' },
    { id: 'rpg',       label: 'RPG / Fantasy' },
    { id: 'scifi',     label: 'Sci-fi / Cyberpunk' },
    { id: 'strategy',  label: 'Strategy / Management' },
    { id: 'sports',    label: 'Sports / Racing' },
    { id: 'casual',    label: 'Casual / Puzzle' },
    { id: 'sandbox',   label: 'Sandbox / Exploration' },
    { id: 'anime',     label: 'Anime / JRPG' },
    { id: 'any',       label: "Doesn't matter" },
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
        key: 'gameType',
        question: 'What kind of games do you enjoy?',
        subtitle: 'Pick as many as you want.',
        type: 'multi',
        options: GAME_TYPES,
    },
    {
        key: 'sessionLength',
        question: 'How long do you want your games to be?',
        subtitle: 'You can pick more than one.',
        type: 'multi',
        layout: 'list',
        options: [
            { id: 'short',  label: 'Less than 10 hours', icon: 'fa-solid fa-clock' },
            { id: 'medium', label: '10 to 30 hours',     icon: 'fa-solid fa-mug-hot' },
            { id: 'long',   label: 'More than 30 hours', icon: 'fa-solid fa-moon' },
            { id: 'any',    label: "Doesn't matter",     icon: 'fa-solid fa-shuffle' },
        ],
    },
    {
        key: 'playMode',
        question: 'Do you prefer to play alone or with others?',
        subtitle: 'Pick the one that best describes you.',
        type: 'single',
        layout: 'list',
        options: [
            { id: 'solo',  label: 'Solo / Story mode', icon: 'fa-solid fa-user' },
            { id: 'multi', label: 'Multiplayer',        icon: 'fa-solid fa-users' },
            { id: 'any',   label: "Doesn't matter",     icon: 'fa-solid fa-shuffle' },
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
        gameType: [] as string[],
        sessionLength: [] as string[],
        playMode: '',
    });
    const [yearFilter, setYearFilter] = useState({ enabled: false, min: 2000, max: MAX_YEAR });
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('Saving your preferences...');

    const current = STEPS[step];
    const isLast = step === STEPS.length - 1;

    const toggleMulti = (key: string, id: string) => {
        setAnswers(prev => {
            const list: string[] = prev[key];
            if (id === 'any') {
                return { ...prev, [key]: list.includes('any') ? [] : ['any'] };
            }
            const withoutAny = list.filter(p => p !== 'any');
            return {
                ...prev,
                [key]: withoutAny.includes(id) ? withoutAny.filter(p => p !== id) : [...withoutAny, id],
            };
        });
    };

    const selectSingle = (key: string, id: string) => {
        setAnswers(prev => ({ ...prev, [key]: id }));
    };

    const canContinue = () => {
        if (current.type === 'multi') return (answers[current.key] as string[]).length > 0;
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
        console.log('[Onboarding] userId →', user?.id, '| payload →', payload);
        const result = await savePreferences(user!.id, payload);
        console.log('[Onboarding] respuesta servidor →', result);
        sessionStorage.removeItem('swipe_deck_v3');
        sessionStorage.removeItem('swipe_index_v3');

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
                <div className="onboarding-logo">
                    <img src={logoSimple} alt="FOMOKiller" className="onboarding-logo-img" />
                    <span className="onboarding-logo-text">FOMO<span className="onboarding-logo-accent">Killer</span></span>
                </div>

                <div className="onboarding-progress">
                    {STEPS.map((_, i) => (
                        <div key={i} className={`onboarding-progress-dot ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`} />
                    ))}
                </div>
                <p className="onboarding-step-count">{step + 1} / {STEPS.length}</p>

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
                        <div className={`onboarding-options ${'layout' in current && current.layout === 'list' ? 'list-options' : current.type === 'multi' ? 'grid-multi' : 'grid-single'}`}>
                            {current.options.map(opt => {
                                const selected = current.type === 'multi'
                                    ? (answers[current.key] as string[]).includes(opt.id)
                                    : answers[current.key] === opt.id;
                                return (
                                    <button
                                        key={opt.id}
                                        className={`onboarding-option ${selected ? 'selected' : ''} ${opt.id === 'any' ? 'any-option' : ''}`}
                                        onClick={() => current.type === 'multi'
                                            ? toggleMulti(current.key, opt.id)
                                            : selectSingle(current.key, opt.id)
                                        }
                                    >
                                        {'icon' in opt && <i className={opt.icon} />}
                                        <span>{opt.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

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
