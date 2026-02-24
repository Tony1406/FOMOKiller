import './ChatPage.css';
import chatIcon from '../assets/chat.png';

export default function ChatPage() {
    return (
        <div className="coming-soon-wrap page-enter">

            <div className="coming-soon-title">Chat y Mensajes</div>
            <p className="coming-soon-desc">Pronto podrás hablar con tus amigos (o con nuestra IA) y compartir tus nuevos descubrimientos.</p>
            <div className="coming-soon-badge">En Construcción</div>
            <div className="coming-soon-features">
                <div className="coming-soon-feat-item">
                    <span>Mensajes directos entre usuarios</span>
                </div>
                <div className="coming-soon-feat-item">
                    <span>Compartir tu backlog fácilmente</span>
                </div>
                <div className="coming-soon-feat-item">
                    <span>Chat con IA</span>
                </div>
            </div>
        </div>
    );
}