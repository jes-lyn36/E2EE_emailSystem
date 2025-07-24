import './LandingPage.css';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div id="landing-page-text">
        <h1 id="landing-page-title">CryptMail</h1>
        <p id="landing-page-subtitle">Your privacy, our priority!</p>
        <br/><br/>

        <Button 
          id="landing-page-register" 
          variant="danger" 
          onClick={() => navigate('/register')}
        >
          Register
        </Button>

        <div id="landing-page-divider">
          <hr className="landing-page-line" />
          <span>or</span>
          <hr className="landing-page-line" />
        </div>

        <Button 
          id="landing-page-login" 
          variant="primary" 
          onClick={() => navigate('/login')}
        >
          Login
        </Button>

      </div>
    </div>
  );
}

export default LandingPage;