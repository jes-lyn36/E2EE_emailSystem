import User from "../models/User.js";
import TempNewSession from "../models/TempNewSession.js";
import crypto, { hash } from "crypto";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export const register = async (req, res) => {
  const {name, email, password, publicKey} = req.body;

  if (!name || !email || !password || !publicKey) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user already exists.
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Email is already registered" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      publicKey,
    });

    // Save session info
    req.session.userId = newUser._id;
    req.session.sessionId = crypto.randomBytes(16).toString("hex");

    await newUser.save();
    res.status(200).json({ message: "User registered successfully", id: newUser._id });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Save session info
  req.session.userId = user._id;
  req.session.sessionId = crypto.randomBytes(16).toString("hex");

  // Flag for new login and session
  user.newLogin = true;
  user.newSession = req.session.sessionId;
  await user.save();

  res.status(200).json({ message: "Found a matching user", id: user._id, name: user.name });
};

export const getpublicKey = async (req, res) => {
  const { email } = req.params;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.status(200).json({ publicKey: user.publicKey });
};

export const checkNewLogin = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.newLogin && user.newSession !== req.session.sessionId) {
    return res.status(200).json({ newLogin: true });
  } else {
    return res.status(200).json({ newLogin: false });
  }
};

export const resetNewLoginFlag = async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.newLogin = false;
  user.newSession = '';
  await user.save();

  res.status(200).json({ message: "New login flag reset successfully" });
};

export const allowNewLoggedIn = async (req, res) => {
  const { userId } = req.params;
  const { givenSessionId, encryptedPrivateKey } = req.body;

  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.newLogin && user.newSession === givenSessionId) {
    // Reset newLogin and newSession after checking
    user.newLogin = false;
    user.newSession = '';
    await user.save();

    const sentInfo = new TempNewSession({
      sessionId: givenSessionId,
      encryptedPrivateKey: encryptedPrivateKey
    });
    await sentInfo.save();

    // Delete the sentInfo after 5 minutes
    setTimeout(async () => {
      await TempNewSession.deleteOne({ sessionId: givenSessionId });
    }, 10 * 1000); // 10 seconds in milliseconds since polling is every 5 seconds

    return res.status(200).json({ privateKeySent: true });
  }

  res.status(400).json({ message: "given session ID is invalid or does not match", privateKeySent: false });
}

export const getEncryptedPrivateKey = async (req, res) => {
  const allowLogin = await TempNewSession.findOne({ sessionId: req.session.sessionId });

  if (!allowLogin) {
    return res.status(404).json({ message: "No private key found for this session" });
  }

  res.status(200).json({ encryptedPrivateKey: allowLogin.encryptedPrivateKey });
}

export const getCurrentUser = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  const user = await User.findById(req.session.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  res.status(200).json({ userId: user._id, name: user.name, email: user.email, publicKey: user.publicKey });
};