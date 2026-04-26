import { Link, useNavigate } from "react-router-dom";
import FuzzyText from "../../components/reactbits/FuzzyText";
import "../../layouts/LandingLayout.css";
import "./ErrorPage.css";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <div className="error-content">
        <FuzzyText
          fontSize="clamp(6rem, 20vw, 14rem)"
          fontWeight={900}
          baseIntensity={0.2}
          hoverIntensity={0.5}
          displaceScale={18}
        >
          401
        </FuzzyText>
        <FuzzyText
          fontSize="clamp(1.6rem, 4vw, 2.8rem)"
          fontWeight={700}
          baseIntensity={0.12}
          hoverIntensity={0.3}
          displaceScale={5}
        >
          Unauthorized
        </FuzzyText>
        <div className="error-actions">
          <button
            className="land-btn land-btn-ghost"
            onClick={() => navigate(-1)}
          >
            <i className="fa-solid fa-arrow-left" /> Go back
          </button>
          <Link to="/login" className="land-btn land-btn-primary">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
