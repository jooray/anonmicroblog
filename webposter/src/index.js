import { getPublicKey, finalizeEvent, validateEvent } from 'nostr-tools';
import { npubEncode } from 'nostr-tools/nip19';
import { SimplePool } from 'nostr-tools/pool';

// here comes the actual npub that you generated from the password
// used to check if the user entered the correct password.
const desiredNpub = 'npub.........';

// make sure you are using the same salt as the one you used to generate the npub above
const salt = 'nooJiSa8ohxeejahve7veix9mahw9kai7y';
const iterations = 10000000;
let privateKey = null;

const pool = new SimplePool();

// adjust relays to your liking
const relays = [
    'wss://nos.lol',
    'wss://nostr.bitcoiner.social',
    'wss://relay.nostr.band',
    'wss://relay.damus.io',
    'wss://nostr.einundzwanzig.space',
    'wss://relay.nostrplebs.com',
    'wss://nostr.orangepill.dev',
    'wss://nostr.plebchain.org',
    'wss://nostr.zebedee.cloud',
    'wss://relay.current.fyi',
    'wss://eden.nostr.land',
    'wss://relay.primal.net',
    'wss://relay.current.fyi',
    'wss://nostr.mutinywallet.com'
];


async function deriveKeys() {
  const password = document.getElementById('password').value;
  const keyLength = 32;
  const enc = new TextEncoder();
  const saltBytes = enc.encode(salt);
  const passwordBytes = enc.encode(password);
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw', passwordBytes, {name: 'PBKDF2'}, false, ['deriveBits']);
  const derivedBits = await window.crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: saltBytes,
    iterations: iterations,
    hash: 'SHA-256'
  }, keyMaterial, keyLength * 8);
  const keyBuffer = new Uint8Array(derivedBits);
  if (npubEncode(getPublicKey(keyBuffer)) !== desiredNpub) {
    document.getElementById('outputArea').innerText = 'The passphrase was unfortunately wrong. Try again.';
    return false;
  } else {
    privateKey = keyBuffer;
    return true;
  }
}

async function postToNostr() {

  const message = document.getElementById('message').value;
  if (message.length < 4) {
    document.getElementById('outputArea').innerText = 'Such a short message? Boost creativity with some meditation please!'
    return;
  }

  const event = {
    pubkey: desiredNpub,
    created_at: Math.floor(Date.now() / 1000),
    kind: 1, // Kind 4 is a direct message
    tags: [],
    content: message
  };

  // Serialize and sign the event
  const signedEvent = finalizeEvent(event, privateKey);

  // Validate the event
  if (!validateEvent(signedEvent)) {
    console.error('Invalid event');
    return;
  }

  document.getElementById('message').disabled = true;
  const sendButton = document.getElementById('sendButton');
  sendButton.disabled = true;
  const originalBackgroundColor = sendButton.style.backgroundColor;
  sendButton.style.backgroundColor = 'grey';
  const originalInnerText = sendButton.innerText;
  sendButton.innerText = 'Submitting to relays';

  // Publish the event
  try {
      await Promise.any(pool.publish(relays, signedEvent));
      sendButton.innerText  = originalInnerText;
      sendButton.disabled = false;
      sendButton.style.backgroundColor = originalBackgroundColor;
      document.getElementById('message').disabled = false;
      document.getElementById('outputArea').innerText = 'Message sent to at least one relay, yay!';

  } catch (error) {
      document.getElementById('outputArea').innerText = 'Failed to publish:' + error;
  }


}

async function deriveKeysAndSubmit() {
  if (await deriveKeys()) {
    document.getElementById('outputArea').innerText = 'Passphrase correct 💃🏼, submitting...';
    await postToNostr();
  }
}

window.deriveKeysAndSubmit = deriveKeysAndSubmit; // Expose function to global scope for HTML button
