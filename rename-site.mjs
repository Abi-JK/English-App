// Helper script to rename the Netlify site via its REST API
import https from 'https';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Read the Netlify auth token from the CLI config
const configDir = path.join(os.homedir(), '.netlify', 'config.json');
let token = '';
try {
  const config = JSON.parse(fs.readFileSync(configDir, 'utf8'));
  token = config.userId ? '' : ''; // fallback - we'll try the credentials file
} catch {}

// Try reading token from credentials file
const credFile = path.join(os.homedir(), '.netlify', 'config.json');
try {
  const raw = JSON.parse(fs.readFileSync(credFile, 'utf8'));
  // The token is stored under the users key
  const users = raw.users || {};
  const firstUser = Object.values(users)[0];
  token = firstUser?.auth?.token || '';
} catch {}

if (!token) {
  // Try alternative location
  try {
    const altCred = path.join(os.homedir(), 'AppData', 'Roaming', 'netlify', 'config.json');
    const raw = JSON.parse(fs.readFileSync(altCred, 'utf8'));
    const users = raw.users || {};
    const firstUser = Object.values(users)[0];
    token = firstUser?.auth?.token || '';
  } catch {}
}

console.log('Token found:', token ? 'YES (length: ' + token.length + ')' : 'NO');

if (!token) {
  console.error('Could not find Netlify auth token. Please run: npx netlify login');
  process.exit(1);
}

const SITE_ID = 'f1fcd1f5-b18e-49c3-a090-5d6895d3d2be';
const NEW_NAME = 'speakup';

const payload = JSON.stringify({ name: NEW_NAME });

const options = {
  hostname: 'api.netlify.com',
  path: `/api/v1/sites/${SITE_ID}`,
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Content-Length': Buffer.byteLength(payload)
  }
};

console.log(`Renaming site ${SITE_ID} to "${NEW_NAME}"...`);

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    if (res.statusCode === 200) {
      const site = JSON.parse(data);
      console.log('✅ SUCCESS!');
      console.log('New site name:', site.name);
      console.log('New URL:', site.ssl_url || site.url);
    } else {
      console.error('❌ Error:', res.statusCode, data);
    }
  });
});

req.on('error', (e) => console.error('Request failed:', e.message));
req.write(payload);
req.end();
