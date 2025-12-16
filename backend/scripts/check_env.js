const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../key.env') });

console.log('Checking environment variables...');
const apiKey = process.env.FIREBASE_WEB_API_KEY;
console.log(`FIREBASE_WEB_API_KEY length: ${apiKey ? apiKey.length : 'undefined'}`);
if (apiKey && (apiKey.startsWith('"') || apiKey.startsWith("'"))) {
    console.log('⚠️ WARNING: API Key starts with a quote. This might be an issue.');
    console.log(`Value: ${apiKey}`);
} else {
    console.log('✅ API Key format looks clean (no leading quotes).');
}

const privateKey = process.env.FIREBASE_PRIVATE_KEY;
if (privateKey && privateKey.includes('\\n')) {
    console.log('ℹ️ Private key contains literal \\n characters (expected for .env files).');
}

console.log('Done.');
