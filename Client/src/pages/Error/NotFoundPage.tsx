import { Link, useNavigate } from "react-router-dom";
import FuzzyText from "../../components/reactbits/FuzzyText";
import "../../layouts/LandingLayout.css";
import "./ErrorPage.css";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-content">
        <FuzzyText
          fontSize="clamp(6rem, 20vw, 14rem)"
          fontWeight={900}
          baseIntensity={0.18}
          hoverIntensity={0.5}
          displaceScale={18}
        >
          404
        </FuzzyText>
        <FuzzyText
          fontSize="clamp(1.6rem, 4vw, 2.8rem)"
          fontWeight={700}
          baseIntensity={0.12}
          hoverIntensity={0.3}
          displaceScale={5}
        >
          Page not found
        </FuzzyText>
        <div className="error-actions">
          <button
            className="land-btn land-btn-ghost"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left" /> Go back
          </button>
          <Link to="/" className="land-btn land-btn-primary">
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
