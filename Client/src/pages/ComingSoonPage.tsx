import './ComingSoonPage.css';
import chatIcon from '../assets/chat.png';

interface ComingSoonProps {
    icon: string;
    title: string;
    description: string;
    features: string[];
}

function ComingSoonPage({ icon, title, description, features }: ComingSoonProps) {
    const isImage = icon.includes('/') || icon.includes('.');

    return (
        <div className="coming-soon-wrap page-enter">
            <div className="coming-soon-icon">
                {isImage ? <img src={icon} alt={title} className="coming-soon-img" /> : icon}
            </div>
            <div className="coming-soon-title">{title}</div>
            <p className="coming-soon-desc">{description}</p>
            <div className="coming-soon-badge">En Construcción</div>
            <div className="coming-soon-features">
                {features.map((f, i) => (
                    <div key={i} className="coming-soon-feat-item">
                        <span>⏳</span>
                        <span>{f}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function ChatPage() {
    return (
        <ComingSoonPage
            icon={chatIcon}
            title="Chat y Mensajes"
            description="Pronto podrás hablar con tus amigos (o con nuestra IA) y compartir tus nuevos descubrimientos."
            features={[
                'Mensajes directos entre usuarios',
                'Compartir tu backlog fácilmente',
                'Chat con IA'
            ]}
        />
    );
}

export function FriendsPage() {
    return (
        <ComingSoonPage
            icon="👥"
            title="Sistema de Amigos"
            description="Conecta con otros jugadores, ve qué están jugando y compara vuestros Top 5."
            features={[
                'Buscar y añadir amigos',
                'Ver el Top 5 de tus amigos',
                'Comparar backlog',
                'Recomendaciones sociales',
            ]}
        />
    );
}
