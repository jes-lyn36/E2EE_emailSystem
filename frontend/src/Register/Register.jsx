import '../LoginRegister/LoginRegister.css';
import '../LoginRegister/LoginRegisterForm.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import CryptoJS from 'crypto-js';
import axios from 'axios';

const backend_url = import.meta.env.VITE_BACKEND_URL;

const Register = ({setWelcomeName, setPassword}) => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');

  const handleRegister = async () => {
    if (!userName || !userEmail || !userPassword) {
      alert('All fields are required');
      return;
    }

    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true,
      ["encrypt", "decrypt"]
    );

    // Export public key as PEM
    const exportedPublicKey = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
    const exportedPrivateKey = await window.crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    function arrayBufferToPem(buffer, type) {
      const binary = String.fromCharCode(...new Uint8Array(buffer));
      const base64 = btoa(binary);
      const lines = base64.match(/.{1,64}/g).join('\n');
      return `-----BEGIN ${type} KEY-----\n${lines}\n-----END ${type} KEY-----`;
    }

    const publicKeyPem = arrayBufferToPem(exportedPublicKey, "PUBLIC");
    const privateKeyPem = arrayBufferToPem(exportedPrivateKey, "PRIVATE");

    try {
      // Call the register API
      const response = await axios.post(`${backend_url}/auth/register`, {
        name: userName,
        email: userEmail,
        password: userPassword,
        publicKey: publicKeyPem
      }, {
        withCredentials: true
      });

      // check if user session is made
      const session = await axios.get(`${backend_url}/auth/check/${response.data.id}`, {
        withCredentials: true
      });

      if (!session.data.loggedIn) {
        alert('Session not created. Please try logging in again.');
        return;
      }

      // encrypt and store private key
      const encryptedPrivateKey = CryptoJS.AES.encrypt(privateKeyPem, userPassword).toString();
      localStorage.setItem('encryptedPrivateKey', encryptedPrivateKey);
      // localStorage.setItem('password', userPassword);

      setWelcomeName(userName);
      setPassword(userPassword);

      navigate('/inbox');
    } catch (error) {
      console.error("Registration error:", error);
      alert('Registration failed: ' + JSON.stringify(error.response.data.message));
    }
  };

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
              <h1 id="login-register-form-title">Register</h1>

              <Form.Group className="login-register-form-input-header mb-3" controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control onChange={e => setUserName(e.target.value)} className="login-register-form-input" type="text" placeholder="" />
              </Form.Group>

              <Form.Group className="login-register-form-input-header mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control onChange={e => setUserEmail(e.target.value)} className="login-register-form-input" type="email" placeholder="" />
              </Form.Group>

              <Form.Group className="login-register-form-input-header mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control onChange={e => setUserPassword(e.target.value)} className="login-register-form-input" type="password" placeholder="" />
              </Form.Group>
              
              <Button onClick={handleRegister} id="login-register-form-switch-button" variant="danger" type="button">
                Register
              </Button>
              <div id="login-register-form-divider">
                <hr className="login-register-form-line" />
                <span>or</span>
                <hr className="login-register-form-line" />
              </div>
              <Form.Text id="login-register-form-switch">
                Already have an account?
              </Form.Text>
              <br/>
              <Button onClick={() => navigate('/login')} id="login-register-form-submit" variant="primary" type="button">
                Login
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;