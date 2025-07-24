// sendEmail, receivedEmail, sentEmail, getEmailById
import User from "../models/User.js";
import Email from "../models/email.js";
import { encryptMessage, idToEmail } from "./helpers.js";

export const sendEmail = async (req, res) => {
  // Implementation for sending email
  const { recipient, title, body, encryptedSymmetricKeyForRecipient, encryptedSymmetricKeyForSender, iv } = req.body;

  if (!recipient || !title || !body) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const senderUser = await User.findById(req.session.userId);

  if (!senderUser) {
    return res.status(404).json({ message: "Sender not found" });
  }

  // Check if the sender is authenticated and authorized to send emails !!!
  // if (!req.user || req.user.email !== sender) {
  //   return res.status(403).json({ message: "Unauthorized access" });
  // }

  const recipientUser = await User.findOne({ email: recipient });

  if (!recipientUser) {
    return res.status(404).json({ message: "Recipient not found" });
  }

  // Just let encryptedAttachments be null for now
  let encryptedAttachments = null;

  // Ecvryption moved to frontend
  // const encryptedMessage = encryptMessage(body, recipientUser.publicKey, senderUser.publicKey);

  // let encryptedAttachments = null;
  // if (attachments) {
  //   encryptedAttachments = attachments.map(attachment => ({
  //     filename: attachment.filename,
  //     contentType: attachment.contentType,
  //     data: encryptMessage(attachment.data, recipientUser.publicKey),
  //   }));
  // }

  // const newEmail = new Email({
  //   senderId: senderUser._id,
  //   recipientId: recipientUser._id,
  //   title,
  //   message: encryptedMessage.encryptedMessage,
  //   recipientEncryptedSymmetricKey: encryptedMessage.recipientEncryptedSymmetricKey,
  //   senderEncryptedSymmetricKey: encryptedMessage.senderEncryptedSymmetricKey,
  //   iv: encryptedMessage.iv,
  //   attachments: encryptedAttachments ? encryptedAttachments : [],
  //   sentAt: new Date(),
  // });

  const newEmail = new Email({
    senderId: senderUser._id,
    recipientId: recipientUser._id,
    title: title,
    message: body,
    recipientEncryptedSymmetricKey: encryptedSymmetricKeyForRecipient,
    senderEncryptedSymmetricKey: encryptedSymmetricKeyForSender,
    iv: iv,
    attachments: encryptedAttachments ? encryptedAttachments : [],
    sentAt: new Date()
  });

  await newEmail.save();
  res.status(201).json({ message: "Email sent successfully", email: newEmail });
};

export const receivedEmails = async (req, res) => {
  // Implementation for receiving email
  const { recipient } = req.params;
  

  if (!recipient) {
    return res.status(400).json({ message: "Recipient email is required" });
  }

  // Check if the user is authenticated and authorized to access the recipient's emails !!!
  // if (!req.user || req.user.email !== recipient) {
  //   return res.status(403).json({ message: "Unauthorized access" });
  // }

  const recipientUser = await User.findOne({ _id: recipient });

  if (!recipientUser) {
    return res.status(404).json({ message: "Recipient not found" });
  } 

  // Fetch received emails from the database
  const emails = await Email.find({ recipientId: recipientUser._id });
  
  let returnedEmails = [];

  for (const email of emails) {
    let mail = {
      recipient: await idToEmail(email.recipientId),
      sender: await idToEmail(email.senderId),
      title: email.title,
      encryptedMessage: email.message,
      encryptedSymmetricKey: email.recipientEncryptedSymmetricKey,
      iv: email.iv
    };
    returnedEmails.push(mail);
  }

  res.status(200).json({ emails: returnedEmails });
};

export const sentEmails = async (req, res) => {
  // Implementation for sent email
  const { sender } = req.params;

  if (!sender) {
    return res.status(400).json({ message: "Sender email is required" });
  }

  const senderUser = await User.findOne({ _id: sender });

  if (!senderUser) {
    return res.status(404).json({ message: "Sender not found" });
  }

  // Check if the user is authenticated and authorized to access the sender's emails !!!
  // if (!req.user || req.user.email !== sender) {
  //   return res.status(403).json({ message: "Unauthorized access" });
  // }

  const emails = await Email.find({ senderId: senderUser._id });
  
  // Decryption is moved to the frontend
  //   // if (emails) {
  //   // Decrypt the messages for the recipient
  //   emails.forEach(email => {
  //     let encryptData = {
  //       encryptedMessage: email.message,
  //       encryptedSymmetricKey: email.senderEncryptedSymmetricKey,
  //       iv: email.iv
  //     };

  //     email.message = decryptMessage(encryptData, senderUser.privateKey);
  //     // if (email.attachments) {
  //     //   email.attachments.forEach(attachment => {
  //     //     attachment.data = decryptMessage(attachment.data, req.user.privateKey);
  //     //   });
  //     // }
  //   });
  // }
  
  let returnedEmails = [];

  for (const email of emails) {
    let mail = {
      recipient: await idToEmail(email.recipientId),
      sender: await idToEmail(email.senderId),
      encryptedMessage: email.message,
      encryptedSymmetricKey: email.senderEncryptedSymmetricKey,
      iv: email.iv
    };
    returnedEmails.push(mail);
  }

  res.status(200).json({ emails: returnedEmails });
};