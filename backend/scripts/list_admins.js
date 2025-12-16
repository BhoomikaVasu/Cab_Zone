const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../key.env') });
const db = require('../config/db');

async function listAdmins() {
    try {
        console.log('Listing admins from Firestore...');
        const snapshot = await db.collection('admins').get();
        if (snapshot.empty) {
            console.log('No admins found.');
        } else {
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
            });
        }
    } catch (error) {
        console.error('Error listing admins:', error);
    }
}

listAdmins();
