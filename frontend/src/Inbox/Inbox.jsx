import './Inbox.css';
import '../Emails/Emails.css';
import '../Email/Email.css';
import Button from 'react-bootstrap/Button';
import Email from '../Email/Email';
import WriteEmail from '../WriteEmail/WriteEmail';
import axios from 'axios';
import { backend_url } from '../../config';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Inbox = ({setCurrentUserId, logout, password, welcomeName}) => {
  const [showCompose, setShowCompose] = useState(false);
  const [inboxEmails, setInboxEmails] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
   const fetchInboxEmails = async () => {
      try {
        // Get current logged in user id
        const userRes = await axios.get(`${backend_url}/auth/getid`, { withCredentials: true });
        const userId = userRes.data.userId;

        setCurrentUserId(userId);

        // Fetch inbox for this user
        const inboxRes = await axios.get(`${backend_url}/email/inbox/${userId}`, { withCredentials: true });
        setInboxEmails(inboxRes.data.emails);
        console.log("Inbox Emails: ", inboxRes.data.emails);
      } catch (error) {
        console.error("Error fetching inbox emails:", error);
      }
    };

    fetchInboxEmails();

    const intervalId = setInterval(fetchInboxEmails, 5000); // Poll every 5 seconds
    return () => clearInterval(intervalId); // Cleanup
  }, []);


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
              onClick={() => setShowCompose(true)}
            >
              <img className="emails-compose-icon" src="./compose.png" alt="Compose"/>
              <span className="emails-compose-text">Compose</span>
            </Button>
          </div>

          <div className="emails-sidebar-menu">
            <div className="emails-sidebar-inbox inbox-active">
              <img id="inbox-icon1" className="emails-inbox-icon" src="./inbox.png" alt="Inbox"/>
              <span className="emails-inbox-text emails-active">Inbox</span>
            </div>

            <div 
              className="emails-sidebar-sent"
              onClick={() => navigate('/sent')}
            >
              <img className="emails-sent-icon" src="./sent.png" alt="Sent"/>
              <span className="emails-sent-text">Sent</span>
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
          {inboxEmails.map((email, index) => (
            // onClick={() => setShowView(true)} was deleted
            <Email password={password} inboxSent={"inbox"} key={index} email={email} />
          ))}
        </div>
      </div>

      <WriteEmail show={showCompose} onClose={() => setShowCompose(false)} />
    </div>
  );
}

export default Inbox;