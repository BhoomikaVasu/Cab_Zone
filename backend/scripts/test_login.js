const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../key.env') });

const email = 'sachinhebbale46@gmail.com';
const password = 'password123';
const apiKey = process.env.FIREBASE_WEB_API_KEY;

async function testLogin() {
    console.log(`Testing login for ${email}...`);
    console.log(`Using API Key: ${apiKey ? apiKey.substring(0, 5) + '...' : 'undefined'}`);

    try {
        const resp = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email,
                password,
                returnSecureToken: true
            })
        });

        const data = await resp.json();

        if (!resp.ok) {
            console.error('❌ Login Failed!');
            console.error('Status:', resp.status);
            console.error('Error:', JSON.stringify(data.error, null, 2));
        } else {
            console.log('✅ Login Successful!');
            console.log('User ID:', data.localId);
            console.log('ID Token length:', data.idToken.length);
        }

    } catch (error) {
        console.error('❌ Request Failed:', error.message);
    }
}

testLogin();
