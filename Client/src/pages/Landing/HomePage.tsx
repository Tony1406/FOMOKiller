import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import eyeps from "../../assets/eyeps.jpg";
import fondoPS2 from "../../assets/fondoPS2.png";
import ps2poster2 from "../../assets/ps2poster2.jpg";
import ColorBends from "../../components/backgrounds/ColorBends";
import "./HomePage.css";

const NAV_SECTIONS = [
  { id: "hero", icon: "fa-house", label: "Home" },
  { id: "features", icon: "fa-bolt", label: "Features" },
  { id: "mission", icon: "fa-crosshairs", label: "Mission" },
  { id: "audience", icon: "fa-users", label: "For who?" },
  { id: "research", icon: "fa-chart-bar", label: "Research" },
  { id: "manifesto", icon: "fa-quote-left", label: "Manifesto" },
];

function LandingSidenav() {
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const scroller = document.querySelector(
      ".landing-root",
    ) as HTMLElement | null;
    if (!scroller) return;

    const onScroll = () => {
      const mid = scroller.scrollTop + scroller.clientHeight / 2;
      let closest = NAV_SECTIONS[0].id;
      let minDist = Infinity;
      NAV_SECTIONS.forEach(({ id }) => {
        const el = document.getElementById(id);
        if (!el) return;
        const absTop = el.getBoundingClientRect().top + scroller.scrollTop;
        const center = absTop + el.offsetHeight / 2;
        const dist = Math.abs(center - mid);
        if (dist < minDist) {
          minDist = dist;
          closest = id;
        }
      });
      setActive(closest);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    const scroller = document.querySelector(
      ".landing-root",
    ) as HTMLElement | null;
    const el = document.getElementById(id);
    if (!scroller || !el) return;
    const absTop = el.getBoundingClientRect().top + scroller.scrollTop;
    scroller.scrollTo({ top: absTop, behavior: "smooth" });
  };

  return (
    <nav className="home-sidenav">
      {NAV_SECTIONS.map(({ id, icon, label }) => (
        <button
          key={id}
          className={`home-sidenav-item${active === id ? " active" : ""}`}
          onClick={() => scrollTo(id)}
          title={label}
        >
          <i className={`fa-solid ${icon}`} />
          <span className="home-sidenav-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}

function AnimatedCounter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const duration = 1600;
        const step = (ts: number, t0: number) => {
          const p = Math.min((ts - t0) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          setCount(Math.floor(eased * to));
          if (p < 1) requestAnimationFrame((t) => step(t, t0));
        };
        requestAnimationFrame((t) => step(t, t));
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function HomePage() {
  useScrollReveal();
  return (
    <div className="home-page">
      <ColorBends
        colors={["#0b00ff", "#0b00ff", "#0b00ff"]}
        rotation={95}
        speed={0.7}
        bandWidth={7}
        intensity={1.5}
        noise={0}
        iterations={1}
        transparent={false}
      />{" "}
      <LandingSidenav />
      <section id="hero" className="home-hero-section">
        <div className="home-hero-img-wrap home-hero-web">
          <img src={fondoPS2} alt="" className="home-hero-img" />
          <div className="home-hero-img-overlay"></div>
        </div>
        <div className="home-hero-img-wrap home-hero-mobile">
          <img src={fondoPS2} alt="" className="home-hero-img" />
          <div className="home-hero-img-overlay home-hero-img-overlay-mobile"></div>
        </div>
        <div className="home-hero">
          <div className="home-hero-content" data-reveal>
            <h1 className="home-title">
              <span className="home-title-line">Kill your</span>
              <span
                className="home-title-line home-title-accent text-glitch text-glitch-gradient"
                data-text="FOMO"
              >
                FOMO
                <svg
                  className="home-title-underline"
                  viewBox="0 0 300 12"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0 6 Q75 0 150 6 Q225 12 300 6"
                    stroke="currentColor"
                    strokeWidth="3"
                    fill="none"
                  />
                </svg>
              </span>
            </h1>
            <p className="home-desc">
              Organize your backlog, discover new games, and focus on what you
              really want to play.
            </p>
            <div className="home-hero-cta">
              <Link
                to="/descarga"
                className="land-btn land-btn-primary home-hero-btn"
              >
                Get Started <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>
            <div className="home-stats">
              <div className="home-stat">
                <span className="home-stat-num">Organize</span>
                <span className="home-stat-label">your backlog</span>
              </div>
              <div className="home-stat-divider"></div>
              <div className="home-stat">
                <span className="home-stat-num">Discover</span>
                <span className="home-stat-label">New Games</span>
              </div>
              <div className="home-stat-divider"></div>
              <div className="home-stat">
                <span className="home-stat-num">Prioritize</span>
                <span className="home-stat-label">what matters</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section id="features" className="home-features">
        <div className="home-section-inner">
          <h2 className="land-section-title">
            Everything you{" "}
            <span className="text-glow text-glitch" data-text="need">
              need
            </span>
          </h2>

          <div className="home-features-wrapper" data-reveal>
            <div className="home-features-poster">
              <img src={eyeps} alt="" className="ps2-poster-img" />
              <div className="poster-glow"></div>
            </div>
            <div className="home-features-content">
              <div className="home-feat-grid">
                <div className="home-feat-card">
                  <div className="home-feat-icon home-feat-icon-cyan">
                    <i className="fa-solid fa-hand-pointer" />
                  </div>
                  <div className="home-feat-info">
                    <h3>Swipe & Discover</h3>
                    <p>
                      Swipe to discover games. Like = add to your backlog. Pass
                      = next.
                    </p>
                  </div>
                </div>
                <div className="home-feat-card">
                  <div className="home-feat-icon home-feat-icon-purple">
                    <i className="fa-solid fa-compass" />
                  </div>
                  <div className="home-feat-info">
                    <h3>Explore</h3>
                    <p>Collections curated by genre, era and theme.</p>
                  </div>
                </div>
                <div className="home-feat-card">
                  <div className="home-feat-icon home-feat-icon-green">
                    <i className="fa-solid fa-list-check" />
                  </div>
                  <div className="home-feat-info">
                    <h3>Backlog</h3>
                    <p>Your list of pending games.</p>
                  </div>
                </div>
                <div className="home-feat-card">
                  <div className="home-feat-icon home-feat-icon-orange">
                    <i className="fa-solid fa-trophy" />
                  </div>
                  <div className="home-feat-info">
                    <h3>Top 5</h3>
                    <p>Only 5 slots. Prioritize your games.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ═══ MISSION ═══ */}
      <section id="mission" className="mission-section">
        <div className="mission-inner">
          <div className="mission-header">
            <h2 className="land-section-title">
              Play what{" "}
              <span className="text-glow text-glitch" data-text="matters">
                matters
              </span>
            </h2>
          </div>

          <div className="mission-values-wrapper" data-reveal>
            <div className="mission-values">
              <div className="mission-card">
                <div className="mission-card-icon">
                  <i className="fa-solid fa-crosshairs"></i>
                </div>
                <div className="mission-card-info">
                  <h3>Focus</h3>
                  <p>
                    Prioritize your games so you don't get lost among 100
                    half-started titles. With our Top 5 system, you only play
                    what truly matters to you.
                  </p>
                </div>
              </div>
              <div className="mission-card">
                <div className="mission-card-icon">
                  <i className="fa-solid fa-trophy"></i>
                </div>
                <div className="mission-card-info">
                  <h3>Achievements</h3>
                  <p>
                    Mark games as completed and celebrate your progress. Every
                    finished game is a win against FOMO.
                  </p>
                </div>
              </div>
            </div>
            <div className="mission-poster">
              <img src={ps2poster2} alt="" className="mission-poster-img" />
            </div>
          </div>
        </div>
      </section>
      {/* ═══ AUDIENCE ═══ */}
      <section id="audience" className="audience-section">
        <div className="mission-inner">
          <h2 className="land-section-title">
            <span className="text-glitch" data-text="Made for:">
              Made for:
            </span>
          </h2>
          <div className="audience-grid" data-reveal>
            <div className="audience-card">
              <div className="mission-card-icon">
                <i className="fa-solid fa-cubes"></i>
              </div>
              <h3>The Hoarder</h3>
              <p>
                You have 200 games on Steam and don't know where to start. Deals
                fill your library but you never play anything.
              </p>
            </div>
            <div className="audience-card">
              <div className="mission-card-icon">
                <i className="fa-solid fa-clock"></i>
              </div>
              <h3>The Busy One</h3>
              <p>
                You have little time to play and don't want to waste it
                choosing. You need a quick, effective filter.
              </p>
            </div>
            <div className="audience-card">
              <div className="mission-card-icon">
                <i className="fa-solid fa-medal"></i>
              </div>
              <h3>The Completionist</h3>
              <p>
                You want to finish what you start before buying another game.
                Top 5 is your perfect tool.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* ═══ RESEARCH ═══ */}
      <section id="research" className="research-section">
        <div className="mission-inner">
          <h2 className="land-section-title research-title-center">
            The impact of the{" "}
            <span className="text-glow text-glitch" data-text='"Pile of Shame"'>
              "Pile of Shame"
            </span>
          </h2>
          <div className="research-grid" data-reveal>
            <div className="research-item">
              <div className="research-value">
                $<AnimatedCounter to={19} />B
              </div>
              <div className="research-label">Lost Investment</div>
              <p>
                Steam users are estimated to have spent over 19 billion dollars
                on games that were never launched even once.
              </p>
            </div>
            <div className="research-item">
              <div className="research-value">
                <AnimatedCounter to={51} suffix="%" />
              </div>
              <div className="research-label">Untouched Libraries</div>
              <p>
                Over half the games in the average player's library remain
                unplayed due to decision fatigue.
              </p>
            </div>
            <div className="research-item">
              <div className="research-value">
                <AnimatedCounter to={25} suffix="%" />
              </div>
              <div className="research-label">Total Abandonment</div>
              <p>
                One in four digitally purchased games is never launched, victims
                of impulse buying and massive sales.
              </p>
            </div>
          </div>
          <div className="research-source">
            <p>
              * Data based on analysis of public Steam accounts and digital
              consumption studies (2024).
            </p>
          </div>
        </div>
      </section>
      {/* ═══ MANIFESTO ═══ */}
      <section id="manifesto" className="manifesto-section">
        <div className="mission-inner">
          <div className="manifesto-card" data-reveal>
            <h2>
              <i className="fa-solid fa-quote-left"></i>
            </h2>
            <p className="manifesto-text">
              You don't need to play every game. You need to play{" "}
              <strong className="text-glitch" data-text="the right games">
                the right games
              </strong>
              . FOMOKiller exists so you stop hoarding and start enjoying.
            </p>
            <div className="manifesto-values-list">
              <div className="manifesto-value">
                <span className="manifesto-icon">✦</span>Simplicity
              </div>
              <div className="manifesto-value">
                <span className="manifesto-icon">✦</span>Focus
              </div>
              <div className="manifesto-value">
                <span className="manifesto-icon">✦</span>Enjoyment
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
