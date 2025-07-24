import './WriteEmail.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState } from 'react';
import axios from 'axios';
import { backend_url } from '../../config';
import { encryptMessage } from '../helpers';
import { receivedEmails } from '../../../backend/routes/email';


function WriteEmail({ show, onClose }) {
  const [recipientEmail, setRecipientEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    try {
      // Step 1: Fetch recipient's public key
      const recipientData = await axios.get(
        `${backend_url}/auth/getkey/${recipientEmail}`,
        { withCredentials: true }
      );

      const senderData = await axios.get(
        `${backend_url}/auth/getid`,
        { withCredentials: true }
      );

      const recipientPublicKeyPem = recipientData.data.publicKey;
      const senderPublicKeyPem = senderData.data.publicKey;

      if (!senderPublicKeyPem) {
        alert("Missing your own public key!");
        return;
      }

      const { encryptedMessage, recipientEncryptedSymmetricKey, senderEncryptedSymmetricKey, iv } = await encryptMessage(message, recipientPublicKeyPem, senderPublicKeyPem);

      console.log("Write Email (encryption) : ")
      console.log("Recipient Public Key: ", recipientPublicKeyPem);
      console.log("Sender Public Key: ", senderPublicKeyPem);
      console.log("title: ", subject);
      console.log("recipient: ", recipientEmail)
      console.log("Encrypted Message: ", encryptedMessage);
      console.log("Encrypted Symmetric Key for Recipient: ", recipientEncryptedSymmetricKey);
      console.log("Encrypted Symmetric Key for Sender: ", senderEncryptedSymmetricKey);
      console.log("IV: ", iv);
      console.log("##########################");

      // Step 6: Send all to backend
      const response = await axios.post(
        `${backend_url}/email/send`,
        {
          recipient: recipientEmail,
          title: subject,
          body: encryptedMessage,
          encryptedSymmetricKeyForRecipient: recipientEncryptedSymmetricKey,
          encryptedSymmetricKeyForSender: senderEncryptedSymmetricKey,
          iv: iv
        },
        { withCredentials: true }
      );

      alert("Email sent: " + response.data.message);
    } catch (error) {
      console.error(error);
      alert("Error sending email: " + error?.response?.data?.message || error.message);
    }

    onClose();
  };

  return (
    <Modal
      show={show}
      onHide={onClose}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton onClick={onClose}>
        <Modal.Title>Compose Email</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <InputGroup className="email-input mb-3">
          <Form.Control
            placeholder="Recipient's Email"
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={e => setRecipientEmail(e.target.value)}
          />
        </InputGroup>

        <hr/>

        <InputGroup className="email-input mb-3">
          <Form.Control
            placeholder="Subject"
            aria-label="Username"
            aria-describedby="basic-addon1"
            onChange={e => setSubject(e.target.value)}
          />
        </InputGroup>

        <hr/>

        <InputGroup>
          <Form.Control 
            placeholder="Message" 
            as="textarea" 
            aria-label="With textarea" 
            className="email-input"
            onChange={e => setMessage(e.target.value)}
          />
        </InputGroup>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Delete message
        </Button>
        <Button onClick={handleSend} variant="primary">Send</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default WriteEmail;