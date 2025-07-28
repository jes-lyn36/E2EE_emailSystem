import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function InputSessionId({ resetNewLoginFlag, setInputSessionId, handleAllowNewLogin, setShow, show }) {

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button style={{ display: "none" }} variant="primary" onClick={handleShow}></Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Paste your session ID from the new device</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
          <Form.Control
            placeholder="Session ID"
            aria-label="sessionId"
            aria-describedby="basic-addon1"
            onChange={(e) => setInputSessionId(e.target.value)}
          />
        </InputGroup>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { resetNewLoginFlag(); handleClose(); }}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { handleAllowNewLogin(); handleClose(); }}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default InputSessionId;