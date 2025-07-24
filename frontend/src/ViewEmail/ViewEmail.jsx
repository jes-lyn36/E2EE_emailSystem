import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { decryptMessage } from '../helpers';
import './ViewEmail.css';
import CryptoJS from 'crypto-js';

function ViewEmail({ password, email, show, onClose }) {
  const [decryptedMessage, setDecryptedMessage] = useState('');

  useEffect(() => {
  const decrypt = async () => {
    const encrypted = localStorage.getItem('encryptedPrivateKey');
    // const password = localStorage.getItem('password');
    console.log(password);
    
    if (!encrypted || !password) return;

    const decryptedPEM = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);

    console.log("EMAIL: ", email.title);

    const encryptedData = {
      encryptedMessage: email.encryptedMessage,
      encryptedSymmetricKey: email.encryptedSymmetricKey,
      iv: email.iv
    };

    try {
      const message = await decryptMessage(encryptedData, decryptedPEM);
      console.log("Decrypted Message: ", message);
      setDecryptedMessage(message);
    } catch (err) {
      console.error("Failed to decrypt message:", err);
      setDecryptedMessage("Failed to decrypt message.");
    }
  };

  decrypt();
}, [email]);

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton onClick={onClose}>
        <Modal.Title>{email.title}</Modal.Title>
      </Modal.Header>

      <h2 className="view-email-name">From: {email.sender}</h2>
      <h2 className="view-email-address"> To: {email.recipient}</h2>

      <hr/>

      <Modal.Body>
        {decryptedMessage}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ViewEmail;