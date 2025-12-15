
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

console.log('--- DIAGNOSTIC START ---');

const envPath = path.join(__dirname, 'key.env');
console.log(`Loading env from: ${envPath}`);

if (!fs.existsSync(envPath)) {
    console.error('ERROR: key.env file not found!');
    process.exit(1);
}

const envConfig = dotenv.config({ path: envPath });
if (envConfig.error) {
    console.error('ERROR: dotenv failed to parse key.env', envConfig.error);
    process.exit(1);
}

console.log('Environment loaded.');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
console.log('PORT:', process.env.PORT);

console.log('Attempting to require ./config/db.js ...');
try {
    const db = require('./config/db');
    console.log('DB module required successfully.');
} catch (error) {
    console.error('ERROR requiring db.js:', error);
}

console.log('--- DIAGNOSTIC END ---');
