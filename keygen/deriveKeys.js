const crypto = require('crypto');
const nostr = require('nostr-tools');

function deriveKeys(password, salt, iterations) {
  const keyLength = 32;
  const digest = 'sha256';

  // Derive a key using PBKDF2
  crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
    if (err) throw err;

    const uint8Key = derivedKey;

    console.log('Derived key in hex: ', uint8Key.toString('hex'));
    const privateKeyNsec = nostr.nip19.nsecEncode(uint8Key);
    const publicKey = nostr.nip19.npubEncode(nostr.getPublicKey(uint8Key));
    console.log('Nostr Private Key (nsec):', privateKeyNsec);
    console.log('Nostr Public Key (npub):', publicKey);
  });
}

if (process.argv.length < 3) {
 console.error("Usage: node derive-keys.js <password> [salt]");
 console.error("Example:");
 console.error("node derive-keys.js mySecretPassword");
 console.error("node derive-keys.js mySecretPassword someSalt");
  process.exit(1);
}

const password = process.argv[2];
const salt = process.argv.length > 3 ? process.argv[3] : 'nooJiSa8ohxeejahve7veix9mahw9kai7y';
const iterations = 10000000;
deriveKeys(password, salt, iterations);
console.log('Salt:', salt);
console.log('Iterations:', iterations);
