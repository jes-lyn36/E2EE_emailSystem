# 📧 CryptMail

**CryptMail** is a small-scale, full-stack web application that simulates a secure end-to-end encrypted email and login system. It combines modern encryption techniques — **AES** for fast symmetric encryption and **RSA** for secure asymmetric key exchange — to deliver both speed and security. Users can register, log in from multiple devices, and send/receive encrypted messages within a clean, responsive UI.

---

## 🚀 Live Demo

[Link here]

---

## 🛠️ Tech Stack

### Frontend
- React
- HTML / CSS
- Material UI (MUI)
- Bootstrap
- Figma *(UI prototyping)*

### Backend
- Node.js
- Express
- TypeScript
- Axios

### Database
- MongoDB

---

## ✨ Features

- 🔐 **End-to-End Encryption**  
  Utilizes **AES** for fast message encryption and **RSA** for secure key exchange between users.

- 🔑 **Secure Multi-Device Authentication**  
  Implements a custom handshake protocol and backend polling system to share private keys securely between devices.

- 📱 **Responsive UI**  

- 📬 **Email Functionality (CRUD)**  
  - Register & login  
  - Compose and send messages  
  - View received (inbox) and sent messages

- 🖥️ **Multi-Page Interface**  
  Includes:
  - Login / Register pages  
  - Inbox (new messages)  
  - Sent messages
  - Email composition form

---

## 🧪 Installation

Follow these steps to run the project locally:

### 1. Clone the Repository

```bash
git clone [repo-link]
cd backend
npm install
npm start
```
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
