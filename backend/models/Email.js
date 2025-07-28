import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  senderId: String,
  recipientId: String,
  title: String,
  message: String,
  recipientEncryptedSymmetricKey: String,
  senderEncryptedSymmetricKey: String,
  iv: String,
  sentAt: {
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  attachments: [{
    filename: String,
    contentType: String,
    data: mongoose.Schema.Types.Buffer
  }]
});

const Email = mongoose.model(
  "Email",
  emailSchema
);
export default Email;