import '../LoginRegister/LoginRegister.css';
import '../LoginRegister/LoginRegisterForm.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { backend_url } from '../../config';

const Login = ({ setWelcomeName, setPassword }) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [startPollingForPrivateKey, setStartPollingForPrivateKey] = useState(false);

  const handleLogin = async () => {
    if (!userEmail || !userPassword) {
      alert('All fields are required');
      return;
    }

    try {
      // Call the login API
      const response = await axios.post(`${backend_url}/auth/login`, {
        email: userEmail,
        password: userPassword
      }, {
        withCredentials: true
      });

      console.log("Login Response:", response.data);

      // check if user session is made
      const session = await axios.get(`${backend_url}/auth/check/${response.data.id}`, {
        withCredentials: true
      });
      console.log("Session Check Response:", session.data);
      if (!session.data.loggedIn) {
        alert('Session not created. Please try logging in again.');
        return;
      }

      // make a popup to show sessionId
      alert(`Session ID: ${session.data.sessionId}`);

      setStartPollingForPrivateKey(true);
      setWelcomeName(response.data.name);
      setPassword(userPassword);
    } catch (error) {
      console.log("Registration error:", error);
      alert('Registration failed: ' + JSON.stringify(error.response.data.message));
    }
  }

  useEffect(() => {
    const fetchPrivateKey = async () => {
      console.log("Polling for private key...");
      if (!startPollingForPrivateKey) return; 
      try {
        const response = await axios.get(`${backend_url}/auth/getEncryptedPrivateKey`, {
          withCredentials: true
        });

        console.log("Private Key Response:", response.data);

        if (response.data.encryptedPrivateKey) {
          localStorage.setItem('encryptedPrivateKey', response.data.encryptedPrivateKey);
          alert('Private key retrieved and stored successfully.');
          setStartPollingForPrivateKey(false);

          navigate('/inbox');
        }
      } catch (error) {
        console.error("Error fetching private key:", error);
      }
    };

    const intervalId = setInterval(fetchPrivateKey, 5000);
    return () => clearInterval(intervalId);
  }, [startPollingForPrivateKey]);

  return (
    <>
      <div className="login-register-page">
        <div className="login-register-welcome-text">
          <h1 className='login-register-title'>Welcome !</h1>
          <p className='login-register-subtitle'>Please login or register an account to continue</p>
        </div>
        <div className="login-register-form-page">
          <img
            src="loginRegisterBox.png"
            alt="login background"
            className="login-register-background"
          />
          <div className='login-register-form' id="login-register-form">
            <Form id="login-register-form">
              <h1 id="login-register-form-title">Login</h1>

              <h2 id="login-register-form-subtitle">
                Please login to your account
              </h2>

              <Form.Group className="login-register-form-input-header mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control onChange={e => setUserEmail(e.target.value)} className="login-register-form-input" type="email" placeholder="" />
              </Form.Group>

              <Form.Group className="login-register-form-input-header mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control onChange={e => setUserPassword(e.target.value)} className="login-register-form-input" type="password" placeholder="" />
              </Form.Group>
              <Button onClick={handleLogin} id="login-register-form-submit" variant="primary" type="button">
                Login
              </Button>
              <div id="login-register-form-divider">
                <hr className="login-register-form-line" />
                <span>or</span>
                <hr className="login-register-form-line" />
              </div>
              <Form.Text id="login-register-form-switch">
                Don't have an account?
              </Form.Text>
              <br/>
              <Button onClick={() => navigate('/register')} id="login-register-form-switch-button" variant="danger" type="submit">
                Register
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;