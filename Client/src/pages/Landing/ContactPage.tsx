import './ContactPage.css';

export default function ContactPage() {
    return (
        <div className="contact-page">
            <div className="contact-header">
                <div className="section-tag">CONTACTO</div>
                <h1 className="land-section-title">
                    ¿Tienes <span className="text-glow">dudas</span>?
                </h1>
                <p className="land-section-desc">
                    Estamos aquí para ayudarte. Escríbenos y te responderemos lo antes posible.
                </p>
            </div>
            <form className="ct-form" onSubmit={e => e.preventDefault()}>
                <div className="ct-form-row">
                    <div className="ct-field">
                        <label>Nombre</label>
                        <input type="text" placeholder="Tu nombre" />
                    </div>
                    <div className="ct-field">
                        <label>Email</label>
                        <input type="email" placeholder="tu@email.com" />
                    </div>
                </div>
                <div className="ct-field">
                    <label>Mensaje</label>
                    <textarea placeholder="¿Cómo podemos ayudarte?" rows={5}></textarea>
                </div>
                <button type="submit" className="land-btn land-btn-primary">
                    <i className="fa-solid fa-paper-plane"></i>
                    Enviar Mensaje
                </button>
            </form>
        </div>
    );
}
