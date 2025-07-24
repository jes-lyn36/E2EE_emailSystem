import './Email.css';
import { useEffect, useState } from 'react';

import ViewEmail from '../ViewEmail/ViewEmail';

const Email = ({ password, inboxSent, email }) => {
  const [showView, setShowView] = useState(false);

  return (
    <>
      <div onClick={() => setShowView(true)} className="email">
        
        <div className="email-icons">
          <img 
            className="email-checkmark" 
            src="./checkmark.png" 
            alt="Email" 
          />
          <img className="email-star" src="./unstar.png" alt="Email"/>
        </div>

        <div className="email-header">
          {inboxSent === "inbox" ? <span>From: {email.sender}</span> : <span>To: {email.recipient}</span>}
        </div>

        <div className="email-summary">
          {email.title}
        </div>

      </div>

      <ViewEmail password={password} email={email} show={showView} onClose={() => setShowView(false)} />
    </>
  );
}

export default Email;