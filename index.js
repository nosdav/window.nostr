import * as secp256k1 from 'https://esm.sh/noble-secp256k1';

// Helper function to generate a new private key and store it in localStorage
async function generatePrivateKey() {
  const privKey = secp256k1.utils.randomPrivateKey();
  const privKeyHex = secp256k1.utils.bytesToHex(privKey);
  localStorage.setItem('nostr:privkey', privKeyHex);
  return privKeyHex;
}

// Helper function to get the private key from localStorage or generate one
async function getPrivateKey() {
  let privKey = localStorage.getItem('nostr:privkey');
  if (!privKey) {
    privKey = await generatePrivateKey();
  }
  return privKey;
}

// Helper function to get the public key from a given private key
async function getPublicKeyFromPrivateKey(privKeyHex) {
  const privKeyBytes = secp256k1.utils.hexToBytes(privKeyHex);
  const pubKeyBytes = secp256k1.getPublicKey(privKeyBytes);
  return secp256k1.utils.bytesToHex(pubKeyBytes);
}

// nostr object implementing NIP-07 methods
const nostr = {
  // Get the public key from the private key stored in localStorage
  async getPublicKey() {
    const privKey = await getPrivateKey();
    return await getPublicKeyFromPrivateKey(privKey);
  },

  // Sign a Nostr event with the stored private key
  async signEvent(event) {
    const privKey = await getPrivateKey();
    const eventSerialized = JSON.stringify(event);
    const eventHash = secp256k1.utils.sha256(eventSerialized);
    const signature = await secp256k1.sign(eventHash, privKey);
    event.sig = secp256k1.utils.bytesToHex(signature);
    return event;
  },

  // Return mock relay information
  async getRelays() {
    return {
      "wss://example-relay.com": { read: true, write: true }
    };
  },

  // NIP-04 encryption and decryption methods
  nip04: {
    // Encrypt a message using a shared secret derived from public/private key pair
    async encrypt(pubkey, plaintext) {
      const privKey = await getPrivateKey();
      const sharedSecret = await secp256k1.getSharedSecret(privKey, pubkey);
      const cipherText = btoa(sharedSecret + plaintext); // Mock encryption with shared secret
      return cipherText;
    },

    // Decrypt a message using a shared secret derived from public/private key pair
    async decrypt(pubkey, ciphertext) {
      const privKey = await getPrivateKey();
      const sharedSecret = await secp256k1.getSharedSecret(privKey, pubkey);
      const decoded = atob(ciphertext);
      return decoded.replace(sharedSecret, ''); // Mock decryption
    }
  }
};

// Export the nostr object so it can be used in any ES6 module
export default nostr;
