# window.nostr - NIP-07 Shim

A lightweight shim for the `window.nostr` interface implementing [NIP-07](https://github.com/nostr-protocol/nips/blob/master/07.md) for Nostr-enabled web applications. This shim includes key management, event signing, and basic encryption/decryption, all in the browser using `localStorage` to store the private key.

## Features

- Implements the NIP-07 interface (`getPublicKey`, `signEvent`, `getRelays`)
- Stores the private key in `localStorage` (`nostr:privkey`)
- Uses secp256k1 for public/private key generation and event signing
- Basic NIP-04 encryption/decryption using shared secrets
- Works entirely in the browser without external dependencies (other than cryptography)
- Modular and extendable

## Installation

You can install this shim via npm:

```bash
npm install window-nostr
```

Or include it directly in your HTML as a script using ES modules:

```html
<script type="module">
  import * as secp256k1 from 'https://esm.sh/noble-secp256k1'
  import 'https://cdn.jsdelivr.net/npm/window-nostr'
</script>
```

## Usage

Once included, the `window.nostr` object will be available globally. Here are some examples of its usage:

### Get the Public Key

```javascript
window.nostr.getPublicKey().then(pubKey => {
  console.log('Public Key:', pubKey)
})
```

### Sign a Nostr Event

```javascript
const event = {
  id: 'some-event-id',
  content: 'Hello, Nostr!',
  created_at: Math.floor(Date.now() / 1000),
  kind: 1,
  pubkey: 'example-pubkey',
  tags: []
}

window.nostr.signEvent(event).then(signedEvent => {
  console.log('Signed Event:', signedEvent)
})
```

### Get Relay Information

```javascript
window.nostr.getRelays().then(relays => {
  console.log('Relays:', relays)
})
```

### Encrypt a Message (NIP-04)

```javascript
const recipientPubKey = 'recipient-public-key'
const message = 'Hello, this is a secret message.'

window.nostr.nip04.encrypt(recipientPubKey, message).then(ciphertext => {
  console.log('Encrypted Message:', ciphertext)
})
```

### Decrypt a Message (NIP-04)

```javascript
const recipientPubKey = 'recipient-public-key'
const encryptedMessage = 'encrypted_message_string'

window.nostr.nip04
  .decrypt(recipientPubKey, encryptedMessage)
  .then(plaintext => {
    console.log('Decrypted Message:', plaintext)
  })
```

## Key Management

- The private key is stored in `localStorage` under the key `nostr:privkey`. If no private key is found, a new one is generated automatically and stored for future use.
- The public key is derived from the stored private key and is returned via `window.nostr.getPublicKey()`.

To clear or reset the private key, simply remove it from `localStorage`:

```javascript
localStorage.removeItem('nostr:privkey')
```

## How It Works

1. **Private Key Management**: The private key is securely stored in `localStorage`. If no key is found, the shim generates one using the `secp256k1` elliptic curve.
2. **Public Key**: The public key is derived from the private key using the `getPublicKey()` method and returned in hex format.

3. **Event Signing**: Events are serialized and signed using the private key. The signature is added to the event as `sig`.

4. **Relays**: The `getRelays()` method returns a mock relay configuration. This can be customized to support real-world relays.

5. **Encryption/Decryption**: The `nip04.encrypt()` and `nip04.decrypt()` methods use a shared secret derived from the sender's private key and the recipient's public key to "encrypt" and "decrypt" messages (currently mocked for simplicity).

## Dependencies

- [noble-secp256k1](https://github.com/paulmillr/noble-secp256k1) - A fast, secure, and pure JavaScript implementation of the secp256k1 elliptic curve, which is used for generating key pairs and signing messages.

## License

MIT License

---

Feel free to contribute, submit issues, or request features! Let's build the future of decentralized communication together.
