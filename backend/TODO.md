# Migration from MongoDB Atlas to Firebase Firestore - TODO List

## Step 1: Update Dependencies
- [x] Remove `mongoose` from package.json
- [x] Add `firebase-admin` to package.json
- [x] Run `npm install` to update dependencies

## Step 2: Update Environment Variables
- [x] Update key.env to include Firebase service account credentials (FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL, etc.)
- [x] Remove MONGODB_URI from key.env

## Step 3: Replace Database Connection
- [x] Update config/db.js to initialize Firebase Admin SDK instead of Mongoose

## Step 4: Update Models (Optional - Firestore is schemaless)
- [x] Simplify or remove models/license.js, models/vehicle.js, models/aadhar.js (since Firestore doesn't require schemas)

## Step 5: Update Routes
- [x] Update routes/LicenseRoutes.js to use Firestore operations (add, get, update, delete)
- [x] Update routes/VehicleRoutes.js to use Firestore operations
- [x] Update routes/AadharRoutes.js to use Firestore operations

## Step 6: Update Server.js
- [x] Update server.js to import and use the new Firebase db connection

## Step 7: Test Endpoints
- [x] Start the server and test all CRUD operations for licenses, vehicles, and aadhars
- [x] Verify data is saved/retrieved from Firestore

## Step 8: Data Migration (Optional)
- [ ] Export data from MongoDB Atlas
- [ ] Import data into Firestore (manually or via script)


## Step 9: Cleanup
- [x] Remove MongoDB Atlas cluster if no longer needed
- [x] Update any documentation
- [x] Remove unused Mongoose models
- [x] Secure session cookies for production environment

