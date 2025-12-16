const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../key.env') });
const db = require('../config/db');

const email = 'sachinhebbale46@gmail.com';
const password = 'password123'; // Default password
const name = 'Sachin Admin';

async function createAdmin() {
    try {
        let userRecord;
        try {
            userRecord = await admin.auth().getUserByEmail(email);
            console.log('User exists:', userRecord.uid);
            // Optional: Update password if needed
            // await admin.auth().updateUser(userRecord.uid, { password: password });
        } catch (error) {
            if (error.code === 'auth/user-not-found') {
                console.log('Creating new user...');
                userRecord = await admin.auth().createUser({
                    email: email,
                    password: password,
                    displayName: name,
                    emailVerified: true
                });
                console.log('User created:', userRecord.uid);
            } else {
                throw error;
            }
        }

        // Add to admins collection
        console.log('Adding to admins collection...');
        await db.collection('admins').doc(userRecord.uid).set({
            email: email,
            name: name,
            role: 'admin',
            createdAt: new Date()
        }, { merge: true });

        console.log('✅ Admin setup complete.');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
