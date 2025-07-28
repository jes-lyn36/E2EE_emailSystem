import express from "express";

import {
  getAuth,
  getEmail,
  getSession,
  deleteAllEmail,
  deleteAllUser,
  deleteAllSession
} from "./routes/routeHandlers.js";

import {
  register,
  login,
  getpublicKey,
  getCurrentUser,
  checkNewLogin,
  getEncryptedPrivateKey,
  allowNewLoggedIn,
  resetNewLoginFlag
} from "./routes/auth.js";

import {
  sendEmail,
  receivedEmails,
  sentEmails
} from "./routes/email.js";

const router = express.Router();

export const requireLogin = (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  next();
};

// Test routes: These are for testing purposes, not actual application logic
router.get("/getAuth", getAuth);
router.get("/getEmail", getEmail);
router.get("/getSession", getSession);
router.delete("/deleteAllEmail", deleteAllEmail);
router.delete("/deleteAllUser", deleteAllUser);
router.delete("/deleteAllSession", deleteAllSession);

// Auth routes
router.post("/auth/register", register);
router.post("/auth/login", login);
router.get("/auth/getkey/:email", getpublicKey);
router.get('/auth/getid', getCurrentUser);
router.get("/auth/checkNewLogin/:userId", requireLogin, checkNewLogin);
router.post("/auth/allowNewLoggedIn/:userId", requireLogin, allowNewLoggedIn);
router.get("/auth/getEncryptedPrivateKey", requireLogin, getEncryptedPrivateKey);
router.delete("/auth/resetNewLoginFlag/:userId", requireLogin, resetNewLoginFlag);

// Email system routes
router.post("/email/send", requireLogin, sendEmail);
router.get("/email/inbox/:recipient", requireLogin, receivedEmails);
router.get("/email/sent/:sender", requireLogin, sentEmails);

// Check session validity
router.get("/auth/check/:id", (req, res) => {
  let userId = req.params.id;

  if (req.session.userId == userId) {
    res.json({ loggedIn: true, sessionId: req.session.sessionId});
  } else {
    res.json({ loggedIn: false });
  }
});

export default router;