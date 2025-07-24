import './Sent.css';
import '../Emails/Emails.css';
import '../Email/Email.css';
import Button from 'react-bootstrap/Button';
import WriteEmail from '../WriteEmail/WriteEmail';
import Email from '../Email/Email';
import axios from 'axios';
import { backend_url } from '../../config';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sent = ({setCurrentUserId, logout, welcomeName, password}) => {
  const [showCompose, setShowCompose] = useState(false);
  const [sentEmails, setSentEmails] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
   const fetchSentEmails = async () => {
      try {
        // Get current logged in user id
        const userRes = await axios.get(`${backend_url}/auth/getid`, { withCredentials: true });
        const userId = userRes.data.userId;

        setCurrentUserId(userId);

        // Fetch sent emails for this user
        const sentRes = await axios.get(`${backend_url}/email/sent/${userId}`, { withCredentials: true });
        setSentEmails(sentRes.data.emails);
        console.log("Sent Emails: ", sentRes.data.emails);
      } catch (error) {
        console.error("Error fetching sent emails:", error);
      }
    };

    fetchSentEmails();
    
    const intervalId = setInterval(fetchSentEmails, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId); // Cleanup
  }, []);

  useEffect(() => {
    console.log("Sent Emails updated: ", sentEmails);
  }, [sentEmails]);

  return (
    <div className="emails">
      <div className="emails-header">
        <div className="emails-header-box">
          <h2 className="emails-header-title">Good Afternoon,</h2>
          <h1 className="emails-header-subtitle">{welcomeName}</h1>
        </div>
      </div>

      <div className="emails-body">
        <div className="emails-sidebar">
          <div className="emails-sidebar-header">
            <Button 
              className="emails-sidebar-compose" 
              variant="danger"
              onClick={() => setShowCompose(true)}>
              <img className="emails-compose-icon" src="./compose.png" alt="Compose"/>
              <span className="emails-compose-text">Compose</span>
            </Button>
          </div>

          <div className="emails-sidebar-menu">
            <div 
              className="emails-sidebar-inbox"
              onClick={() => navigate('/inbox')}
            >
              <img id="inbox-icon2" className="emails-inbox-icon" src="./inbox2.png" alt="Inbox"/>
              <span className="emails-inbox-text">Inbox</span>
            </div>

            <div className="emails-sidebar-sent inbox-active">
              <img className="emails-sent-icon" src="./sent2.png" alt="Sent"/>
              <span className="emails-sent-text emails-active">Sent</span>
            </div>
          </div>

          <div className="emails-sidebar-footer">
            <h2 className="emails-sidebar-logout"></h2>
            <div className="emails-sidebar-box">
              <span className="emails-logout-text">Account</span>
              <Button 
                className="emails-sidebar-logout-button" 
                variant="danger"
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        <div className="emails-list">
          {sentEmails.map((email, index) => (
            // onClick={() => setShowView(true)} was deleted
            <Email password={password} inboxSent={"sent"} key={index} email={email} />
          ))}
        </div>
      </div>

      <WriteEmail show={showCompose} onClose={() => setShowCompose(false)} />
    </div>
  );
}

export default Sent;