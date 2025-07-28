import mongoose from "mongoose";

const tempNewSessionSchema = new mongoose.Schema({
  sessionId: String,
  encryptedPrivateKey: String
});

const TempNewSession = mongoose.model(
  "TempNewSession",
  tempNewSessionSchema
);
export default TempNewSession;