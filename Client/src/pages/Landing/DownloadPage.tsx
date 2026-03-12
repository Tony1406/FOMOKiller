import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import downloadImage from '../../assets/image.png';
import './DownloadPage.css';

export default function DownloadPage() {
    const { user } = useContext(AuthContext);
    return (
        <div className="download-page">
            <div className="download-content">
                <div className="section-tag">DESCARGA</div>
                <h1 className="land-section-title">
                    Lleva FOMOKiller <span className="text-glow">contigo</span>
                </h1>
                <p className="land-section-desc">
                    Próximamente en iOS y Android. Mientras tanto,
                    usa la versión web desde cualquier dispositivo.
                </p>
                <div className="dl-badges">
                    <div className="dl-badge">
                        <i className="fa-brands fa-apple"></i>
                        <div>
                            <span className="dl-badge-sub">Próximamente en</span>
                            <span className="dl-badge-main">App Store</span>
                        </div>
                    </div>
                    <div className="dl-badge">
                        <i className="fa-brands fa-google-play"></i>
                        <div>
                            <span className="dl-badge-sub">Próximamente en</span>
                            <span className="dl-badge-main">Google Play</span>
                        </div>
                    </div>
                </div>
                <Link to={user ? "/app" : "/login"} className="land-btn land-btn-primary dl-web-btn">
                    <i className="fa-solid fa-globe"></i>
                    Usar versión web ahora
                </Link>
            </div>
            <div className="download-visual">
                <img src={downloadImage} alt="FOMOKiller App" className="dl-main-image" />
            </div>
        </div>
    );
}
