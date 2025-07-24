import crypto from 'crypto';
import User from "../models/User.js";

const ALGORITHM = 'aes-256-cbc';
const IV_LENGTH = 16;

// export function encryptMessage(message, publicKey) {
//   return crypto.publicEncrypt({
//     key: publicKey,
//     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//     oaepHash: "sha256",
//   }, Buffer.from(message, 'base64'));
// }

// export function decryptMessage(encryptedMessage, privateKey) {
//   return crypto.privateDecrypt({
//     key: privateKey,
//     padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
//     oaepHash: "sha256",
//   }, encryptedMessage).toString();
// }

export const encryptMessage = (message, recipientPublicKey, senderPublicKey) => {
  // 1. Generate a random symmetric key
  const symmetricKey = crypto.randomBytes(32); // 32 bytes for AES-256
  const iv = crypto.randomBytes(IV_LENGTH); // Initialization Vector

  // 2. Encrypt the message with the symmetric key
  const cipher = crypto.createCipheriv(ALGORITHM, symmetricKey, iv);
  let encryptedMessage = cipher.update(message, 'utf8', 'hex');
  encryptedMessage += cipher.final('hex');

  // 3. Encrypt the symmetric key with the recipient's RSA public key
  // You might need to import the public key properly, depending on its format (PEM, etc.)

  const recipientEncryptedSymmetricKey = crypto.publicEncrypt(
    {
      key: recipientPublicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, // Recommended padding for RSA
    },
    symmetricKey
  ).toString('base64'); // Store as base64

  const senderEncryptedSymmetricKey = crypto.publicEncrypt(
    {
      key: senderPublicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, // Recommended padding for RSA
    },
    symmetricKey
  ).toString('base64'); // Store as base64

  return {
    encryptedMessage: encryptedMessage,
    recipientEncryptedSymmetricKey: recipientEncryptedSymmetricKey,
    senderEncryptedSymmetricKey: senderEncryptedSymmetricKey,
    iv: iv.toString('hex') // Store IV for decryption
  };
};

export const decryptMessage = (encryptedData, userPrivateKey) => {
  const { encryptedMessage, encryptedSymmetricKey, iv } = encryptedData;

  // 1. Decrypt the symmetric key with the user's RSA private key
  const decryptedSymmetricKey = crypto.privateDecrypt(
    {
      key: userPrivateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
    },
    Buffer.from(encryptedSymmetricKey, 'base64')
  );

  // 2. Decrypt the message with the symmetric key
  const decipher = crypto.createDecipheriv(ALGORITHM, decryptedSymmetricKey, Buffer.from(iv, 'hex'));
  let decryptedMessage = decipher.update(encryptedMessage, 'hex', 'utf8');
  decryptedMessage += decipher.final('utf8');

  return decryptedMessage;
};

export const idToEmail = async (userId) => {
  const recipientUser = await User.findOne({ _id: userId });
  return recipientUser ? recipientUser.email : null;
}