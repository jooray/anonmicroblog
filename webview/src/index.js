import { SimplePool } from 'nostr-tools/pool';
import { verifyEvent } from 'nostr-tools/pure';

// change to your public key (hex not npub)
const publicKey = '.........';

// set relays
const relayURLs = [
  'wss://nos.lol',
  'wss://nostr.bitcoiner.social',
  'wss://relay.nostr.band',
  'wss://relay.damus.io',
  'wss://nostr.einundzwanzig.space',
  'wss://relay.nostrplebs.com'
];

// which year the posts start (we do not want to look this up dynamically)
const startYear = 2024;

const pool = new SimplePool();
let posts = [];

function processContent(content) {

  content = content.replace(/\n/gi, '\n<br/>\n');

  // Handle image URLs
  content = content.replace(/(https?:\/\/[^\s]+?\.(jpg|jpeg|png|gif|webp))/gi, '<img src="$1" style="max-width:100%;height:auto;">');

  // Handle audio URLs (.mp3, .m4a, .wav)
  content = content.replace(/(https?:\/\/[^\s]+?\.(mp3|m4a|wav))/gi, '<audio controls><source src="$1" type="audio/$2"></audio>');

  // Handle video URLs (.mp4, and other common video tags)
  content = content.replace(/(https?:\/\/[^\s]+?\.(mp4|webm|ogv|avi))/gi, '<video controls><source src="$1" type="video/$2"></video>');

  // Convert Markdown links [text](url) to HTML links
  content = content.replace(/\[([^\]]+)\]\((https?:\/\/[^\s]+?)\)/gi, '<a href="$2" target="_blank">$1</a>');

  // Convert Markdown bold **text** to HTML bold
  content = content.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

  // Convert Markdown italic *text* to HTML italic
  content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');

  return content;
}

function renderPosts() {
  const contentElement = document.getElementById('content');
  contentElement.innerHTML = ''; // Clear previous content

  // Sort posts by created_at descending
  posts.sort((a, b) => b.created_at - a.created_at);

  // Convert posts to HTML and join them
  contentElement.innerHTML = posts.map(post => `<hr><div class="note">${processContent(post.content)}</div>`).join('');
}

async function fetchPosts(year) {
  const since = new Date(`${year}-01-01`).getTime() / 1000;
  const until = new Date(`${year}-12-31`).getTime() / 1000;
  const filter = {
    kinds: [1], // Assuming kind 1 for text posts
    authors: [publicKey],
    since: since,
    until: until
  };

  posts = []; // Reset posts array for the new fetch

  pool.subscribeMany(
    relayURLs,
    [filter],
    {
      onevent(event) {
        if (verifyEvent(event)) {
          if (!posts.some(post => post.id === event.id)) { // Check for duplicate IDs in the existing posts array
            posts.push(event); // Collect posts if not already present
            renderPosts(); // Render posts as they arrive and are verified
          }
        }
      },
      onclose() {
        console.log("Subscription ended.");
      }
    }
  );
}

function createMenu() {
  const currentYear = new Date().getFullYear();
  const menuElement = document.getElementById('menu');
  let menuHtml = '';

  for (let year = currentYear; year >= startYear; year--) {
    menuHtml += `<a href="#" onclick="loadYear(${year})">${year}</a> | `;
  }
  menuElement.innerHTML = menuHtml.slice(0, -3);
}

window.loadYear = async (year) => {
  await fetchPosts(year);
}

document.addEventListener('DOMContentLoaded', () => {
  createMenu();
  loadYear(new Date().getFullYear());
});
