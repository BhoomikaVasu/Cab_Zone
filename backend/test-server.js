require('dotenv').config({ path: require('path').join(__dirname, 'key.env') });

console.log('=== Environment Variables Check ===');
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID ? 'SET' : 'NOT SET');
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? 'SET' : 'NOT SET');
console.log('FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? 'SET (length: ' + process.env.FIREBASE_PRIVATE_KEY.length + ')' : 'NOT SET');
console.log('PORT:', process.env.PORT || '5000 (default)');

console.log('\n=== Starting Server ===');

try {
    const express = require('express');
    const app = express();
    const PORT = process.env.PORT || 5000;

    app.get('/health', (req, res) => {
        res.json({ status: 'ok', message: 'Server is running!' });
    });

    app.listen(PORT, () => {
        console.log(`✓ Server successfully started on port ${PORT}`);
        console.log(`✓ Access it at: http://localhost:${PORT}`);
        console.log(`✓ Health check: http://localhost:${PORT}/health`);
    });
} catch (error) {
    console.error('✗ Server failed to start:', error.message);
    process.exit(1);
}
