import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import ColorBends from "../../components/backgrounds/ColorBends";
import "./DownloadPage.css";

export default function DownloadPage() {
  const { user } = useContext(AuthContext);
  return (
    <div className="download-bg-root">
      <ColorBends
        colors={["#0b00ff", "#0b00ff", "#0b00ff"]}
        rotation={95}
        speed={0.5}
        bandWidth={6}
        intensity={1.5}
        noise={0}
        iterations={1}
        transparent={false}
      />
      <div className="download-page download-page--centered">
        <div className="download-content download-content--centered">
          <div className="section-tag">GET STARTED</div>
          <h1 className="land-section-title">
            Your backlog,
            <br />
            <span className="text-glow text-glitch" data-text="under control">
              under control
            </span>
          </h1>
          <p className="land-section-desc dl-desc-centered">
            Create your free account and start organizing your games in seconds.
            No downloads, no installs — works from any browser.
          </p>

          <div className="dl-perks dl-perks--centered">
            <div className="dl-perk">
              <i className="fa-solid fa-bolt"></i>
              <span>Up and running in less than 1 minute</span>
            </div>
            <div className="dl-perk">
              <i className="fa-solid fa-lock-open"></i>
              <span>Free forever — no credit card</span>
            </div>
            <div className="dl-perk">
              <i className="fa-solid fa-globe"></i>
              <span>Access from any device</span>
            </div>
          </div>

          <div className="dl-cta-group dl-cta-group--centered">
            {user ? (
              <Link to="/app" className="land-btn land-btn-primary dl-cta-main">
                <i className="fa-solid fa-gamepad"></i>
                Let's go
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="land-btn land-btn-primary dl-cta-main"
                >
                  <i className="fa-solid fa-user-plus"></i>
                  Let's go
                </Link>
                <Link to="/login" className="land-btn land-btn-ghost">
                  I already have an account
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
