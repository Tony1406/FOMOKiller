import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import './DownloadPage.css';

export default function DownloadPage() {
    const { user } = useContext(AuthContext);
    return (
        <div className="download-page download-page--centered">
            <div className="download-content download-content--centered">
                <div className="section-tag">EMPIEZA AHORA</div>
                <h1 className="land-section-title">
                    Tu backlog,<br />
                    <span className="text-glow">bajo control</span>
                </h1>
                <p className="land-section-desc dl-desc-centered">
                    Crea tu cuenta gratis y empieza a organizar tus juegos en segundos.
                    Sin descargas, sin instalaciones — funciona desde cualquier navegador.
                </p>

                <div className="dl-perks dl-perks--centered">
                    <div className="dl-perk">
                        <i className="fa-solid fa-bolt"></i>
                        <span>Lista y funcionando en menos de 1 minuto</span>
                    </div>
                    <div className="dl-perk">
                        <i className="fa-solid fa-lock-open"></i>
                        <span>Gratis para siempre — sin tarjeta</span>
                    </div>
                    <div className="dl-perk">
                        <i className="fa-solid fa-globe"></i>
                        <span>Accede desde cualquier dispositivo</span>
                    </div>
                </div>

                <div className="dl-cta-group dl-cta-group--centered">
                    {user ? (
                        <Link to="/app" className="land-btn land-btn-primary dl-cta-main">
                            <i className="fa-solid fa-gamepad"></i>
                            Empecemos
                        </Link>
                    ) : (
                        <>
                            <Link to="/register" className="land-btn land-btn-primary dl-cta-main">
                                <i className="fa-solid fa-user-plus"></i>
                                Empecemos
                            </Link>
                            <Link to="/login" className="land-btn land-btn-ghost">
                                Ya tengo cuenta
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
