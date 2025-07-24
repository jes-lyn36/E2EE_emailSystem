// Convert PEM to CryptoKey
async function importRSAPublicKey(pem) {
  const binaryDer = str2ab(pemToBase64(pem));
  return await crypto.subtle.importKey(
    "spki",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["encrypt"]
  );
}

async function importRSAPrivateKey(pem) {
  const binaryDer = str2ab(pemToBase64(pem));
  return await crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    {
      name: "RSA-OAEP",
      hash: "SHA-256"
    },
    true,
    ["decrypt"]
  );
}

// Convert PEM string to Base64
function pemToBase64(pem) {
  return pem.replace(/-----BEGIN PUBLIC KEY-----/, "")
            .replace(/-----END PUBLIC KEY-----/, "")
            .replace(/-----BEGIN PRIVATE KEY-----/, "")
            .replace(/-----END PRIVATE KEY-----/, "")
            .replace(/\s+/g, "");
}

function str2ab(str) {
  const binary = atob(str);
  const len = binary.length;
  const buffer = new ArrayBuffer(len);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < len; i++) {
    view[i] = binary.charCodeAt(i);
  }
  return buffer;
}

export async function encryptMessage(message, recipientPublicKeyPEM, senderPublicKeyPEM) {
  const recipientKey = await importRSAPublicKey(recipientPublicKeyPEM);
  const senderKey = await importRSAPublicKey(senderPublicKeyPEM);

  // Generate AES key
  const aesKey = await crypto.subtle.generateKey(
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );

  // IV
  const iv = crypto.getRandomValues(new Uint8Array(12)); // 96 bits for GCM

  // Encrypt message
  const encryptedMessageBuffer = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    new TextEncoder().encode(message)
  );

  // Export AES key to raw
  const rawAesKey = await crypto.subtle.exportKey("raw", aesKey);

  // Encrypt AES key with recipient and sender public keys
  const encryptedSymmetricKeyForRecipient = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    recipientKey,
    rawAesKey
  );

  const encryptedSymmetricKeyForSender = await crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    senderKey,
    rawAesKey
  );

  return {
    encryptedMessage: bufferToBase64(encryptedMessageBuffer),
    recipientEncryptedSymmetricKey: bufferToBase64(encryptedSymmetricKeyForRecipient),
    senderEncryptedSymmetricKey: bufferToBase64(encryptedSymmetricKeyForSender),
    iv: bufferToBase64(iv)
  };
}

function bufferToBase64(buffer) {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

function base64ToArrayBuffer(base64) {
  const binary = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  return binary.buffer;
}

export async function decryptMessage(encryptedData, userPrivateKeyPEM) {
  const privateKey = await importRSAPrivateKey(userPrivateKeyPEM);
  const encryptedSymmetricKey = encryptedData.encryptedSymmetricKey;

  console.log("View Email (decrypting): ")
  console.log("Private key PEM: ", userPrivateKeyPEM);
  console.log("Private key: ", privateKey);
  console.log("encryptedMessage: ", encryptedData.encryptedMessage);
  console.log("encryptedSymmetricKey: ", encryptedSymmetricKey);
  console.log("iv: ", encryptedData.iv);
  console.log("##########################");

  console.log("Key length:", encryptedSymmetricKey.length);
  console.log("Key preview:", encryptedSymmetricKey.slice(0, 50));
  console.log("Invalid char test:", /[^A-Za-z0-9+/=]/.test(encryptedSymmetricKey));
  console.log("Type of encryptedSymmetricKey:", typeof encryptedSymmetricKey);
  console.log("Is string:", typeof encryptedSymmetricKey === "string");
  console.log("Value:", encryptedSymmetricKey);

  // Decrypt symmetric key
  const decryptedSymmetricKeyBuffer = await crypto.subtle.decrypt(
  { name: "RSA-OAEP" },
  privateKey,
  base64ToArrayBuffer(encryptedSymmetricKey)
);

  console.log("Decrypted Symmetric Key: ", decryptedSymmetricKeyBuffer);

  // Import AES key
  const aesKey = await crypto.subtle.importKey(
    "raw",
    decryptedSymmetricKeyBuffer,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  // Decrypt message
  const decryptedMessageBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: base64ToArrayBuffer(encryptedData.iv)
    },
    aesKey,
    base64ToArrayBuffer(encryptedData.encryptedMessage)
  );

  return new TextDecoder().decode(decryptedMessageBuffer);
}