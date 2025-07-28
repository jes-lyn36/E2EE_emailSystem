import Button from 'react-bootstrap/Button';
import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import LandingPage from '../LandingPage/LandingPage';
import Register from '../Register/Register';
import Login from '../Login/Login';
import Inbox from '../Inbox/Inbox';
import Sent from '../Sent/Sent';
import Email from '../Email/Email';
import InputSessionId from '../InputSessionId/InputSessionId';

const backend_url = import.meta.env.VITE_BACKEND_URL;

const Pages = () => {
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const location = window.location;
  const [welcomeName, setWelcomeName] = useState('User');
  const [password, setPassword] = useState('');
  const [showSessionIdInput, setShowSessionIdInput] = useState(false);
  const [inputSessionId, setInputSessionId] = useState('');
  const [currentUserId, setCurrentUserId] = useState('');

  const logout = async () => {
    try {
      localStorage.removeItem('encryptedPrivateKey');
      setPassword("")
      navigate('/');
    } catch (error) {
      alert('Logout failed:', error);
    }
  };

  useEffect(() => {
    const handleShowSessionIdInput = async () => {
      if (!currentUserId) return;

      const response = await axios.get(`${backend_url}/auth/checkNewLogin/${currentUserId}`, {
        withCredentials: true
      });

      if (response.data.newLogin) {
        setShowSessionIdInput(true);
      }
    };

    handleShowSessionIdInput();
    
    const intervalId = setInterval(handleShowSessionIdInput, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId); // Cleanup
  }, [currentUserId]);

  const resetNewLoginFlag = async () => {
    try {
      const response = await axios.delete(`${backend_url}/auth/resetNewLoginFlag/${currentUserId}`, {
        withCredentials: true
      });
      if (response.data.success) {
        setShowSessionIdInput(false);
        setInputSessionId('');
      } else {
        console.error("Failed to reset new login flag");
      }
    } catch (error) {
      console.error("Error resetting new login flag:", error);
      alert('Error resetting new login flag:', error.message);
    }
  };

  const handleAllowNewLogin = async () => {
    if (!showSessionIdInput || !inputSessionId) return;

    try {
      const response = await axios.post(`${backend_url}/auth/allowNewLoggedIn/${currentUserId}`, {
        givenSessionId: inputSessionId,
        encryptedPrivateKey: localStorage.getItem('encryptedPrivateKey')
      }, {
        withCredentials: true
      });

      if (response.data.privateKeySent) {
        alert('Private key sent successfully!');
        setShowSessionIdInput(false);
        setInputSessionId('');
      } else {
        alert('Failed to send private key.');
      }
    } catch (error) {
      console.error("Error allowing new login:", error);
      alert('Error allowing new login:', error.message);
    }
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register token={token} setWelcomeName={setWelcomeName} setPassword={setPassword} />} />
        <Route path="/login" element={<Login token={token} setWelcomeName={setWelcomeName} setPassword={setPassword}/>} />
        <Route path="/inbox" element={<Inbox setCurrentUserId={setCurrentUserId} logout={logout} password={password} welcomeName={welcomeName}/>} />
        <Route path="/sent" element={<Sent setCurrentUserId={setCurrentUserId} logout={logout} password={password} welcomeName={welcomeName}/>} />
        <Route path="/email" element={<Email />} />
      </Routes>

      <InputSessionId resetNewLoginFlag={resetNewLoginFlag} setInputSessionId={setInputSessionId} handleAllowNewLogin={handleAllowNewLogin} setShow={setShowSessionIdInput} show={showSessionIdInput} />
    </>
  );
};

export default Pages;