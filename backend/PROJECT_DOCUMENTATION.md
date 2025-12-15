# Multi‑Tenant SaaS: DL & RC Extractor – Project Documentation

## Executive Summary

- Secure multi‑tenant SaaS for cab owners built on Firebase Authentication, Firestore, Cloudinary, Node.js (Express), and Gemini OCR.
- Two roles: Admin and Cab Owner. Admin has full oversight; each owner manages only their own data.
- Firestore structure standardized under `cabOwners/{ownerUid}` with isolated subcollections `drivers` and `vehicles`.
- All document uploads (DL, Aadhaar, RC, Insurance, Pollution, Fitness, Permit) go to Cloudinary. Extracted fields from Gemini are stored back in Firestore within the owner’s scope.
- Old global collections removed from usage; all queries replaced with owner‑scoped paths.

## Tech Stack

- Backend: Node.js (Express), Helmet, CORS, Rate Limiting
- Auth: Firebase Authentication (Email/Password), Session Cookies
- Data: Firestore (cabOwners with subcollections)
- Storage: Cloudinary
- OCR: Google Gen AI (Gemini 2.5‑flash)
- Frontend: Static pages with vanilla JS (`auth.js`, `app.js`, `admin.js`)

## Environment & Configuration

- `.env`: loaded via `key.env` in server: `server.js:10`
- Required variables:
  - `FIREBASE_PROJECT_ID`, `FIREBASE_WEB_API_KEY`
  - `CLOUDINARY_URL` or `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
  - `GEMINI_API_KEY`
  - `PORT` (defaults 3000)
  - `NODE_ENV` (`production` toggles secure cookies)
- Firebase client config route: `server.js:68` returns `{ apiKey, authDomain, projectId }` for `auth.js` initialization when needed.

## Server & Middleware

- Express setup, security, static serving, and rate limit: `server.js:23`, `server.js:37`, `server.js:49`, `server.js:44`
- Health check: `server.js:58`
- Global error handler: `server.js:75`
- Route mounts (owner‑scoped APIs): `server.js:50`–`server.js:55`

### Authentication Middleware

- `requireOwner`: verifies session cookie, checks `cabOwners/{uid}`, attaches `req.ownerId`. `middleware/authMiddleware.js:14`
- `requireAdmin`: verifies session cookie and checks `admins/{uid}` or email match. `middleware/authMiddleware.js:44`

## Roles, Login, and Session

### Cab Owner

- Signup: creates Firebase user, sets custom claim `role: 'owner'`, writes `cabOwners/{uid}` doc. `routes/AuthRoutes.js:15`, `routes/AuthRoutes.js:37`, `routes/AuthRoutes.js:39`
- Login: server signs in against Firebase REST API, sets session cookie (5 days). `routes/AuthRoutes.js:53`, `routes/AuthRoutes.js:70`
- Client fallback via SDK (`auth.js`) in case server login returns an error. `public/auth.js:61`

### Admin

- Login: server verifies credentials and admin status (`admins` collection), sets `role: 'admin'` claim and session cookie. `routes/AuthRoutes.js:79`, `routes/AuthRoutes.js:90`, `routes/AuthRoutes.js:97`, `routes/AuthRoutes.js:100`
- Admin APIs protected by `requireAdmin`. `routes/AdminRoutes.js:5`

### Session Exchange & Logout

- `/auth/session`: exchanges ID token for session cookie and ensures role claims set. `routes/AuthRoutes.js:109`–`routes/AuthRoutes.js:142`
- `/auth/logout`: clears session cookie. `routes/AuthRoutes.js:144`

## Firestore Data Model

```
cabOwners
  └── {ownerUid}
      ├── name, email, phone, plan, createdAt
      ├── drivers (subcollection)
      │   └── {driverId}
      │       ├── name, phone, dob, address, bloodGroup, licenseNumber
      │       ├── dl: { imageUrl, cloudinaryPublicId, extractedData, extractedAt }
      │       └── aadhaar: { imageUrl, cloudinaryPublicId, extractedData, extractedAt }
      └── vehicles (subcollection)
          └── {vehicleId}
              ├── carName, carNumberPlate, model, fuelType, year, ownerName
              └── documents: {
                    rc|insurance|pollution|fitness|permit: {
                      imageUrl, cloudinaryPublicId, extractedData, extractedAt
                    }
                 }
```

All reads/writes are scoped with `req.ownerId`. No global collections are used.

## Cloudinary Upload Strategy

- Owner‑scoped foldering for discovery and cleanup:
  - DL: `cabOwners/{ownerId}/licenses/{driverId}-{timestamp}` `routes/LicenseRoutes.js:65`
  - Aadhaar: `cabOwners/{ownerId}/aadhar/{driverId}-{timestamp}` `routes/AadharRoutes.js:58`
  - Vehicles docs: `cabOwners/{ownerId}/vehicles/{vehicleId}-<docType>-{timestamp}` `routes/VehicleRoutes.js:95`
- On delete, Cloudinary public IDs are removed for vehicle docs and DL/Aadhaar. `routes/LicenseRoutes.js:215`, `routes/AadharRoutes.js:206`, `routes/VehicleRoutes.js:192`

## OCR & Extraction

- Gemini 2.5‑flash used with JSON schema for consistent outputs:
  - DL fields: name, licenseNumber, dob, address, validity, doi, bg, cov, lmvValidity, mcwgValidity. `routes/LicenseRoutes.js:79`
  - Aadhaar fields: name, aadhaar_no, dob, gender, address, pincode. `routes/AadharRoutes.js:72`
  - Vehicle RC: registrationNo, registrationDate, rcValidUpto, ownerName, address, chassisNo, engineNo, model, fuelType. `routes/VehicleRoutes.js:106`
  - Other vehicle docs: insurance, pollution, fitness, permit with key fields. `routes/VehicleRoutes.js:111`, `routes/VehicleRoutes.js:116`, `routes/VehicleRoutes.js:121`, `routes/VehicleRoutes.js:126`
- If `GEMINI_API_KEY` missing or extraction fails, server proceeds and stores upload metadata with empty `extractedData`. `routes/LicenseRoutes.js:45`, `routes/LicenseRoutes.js:104`, `routes/AadharRoutes.js:100`, `routes/VehicleRoutes.js:61`

## Owner APIs (Protected)

- Drivers
  - `GET /api/drivers` list owner’s drivers. `routes/DriverRoutes.js:9`
  - `POST /api/drivers` create/update driver. `routes/DriverRoutes.js:33`
  - `DELETE /api/drivers/:id` delete driver. `routes/DriverRoutes.js:74`

- Licenses
  - `POST /api/licenses` upload DL for `driverId` and save OCR. `routes/LicenseRoutes.js:39`
  - `GET /api/licenses` list drivers that have DL data. `routes/LicenseRoutes.js:148`
  - `PUT /api/licenses/:id` update extracted data for a driver. `routes/LicenseRoutes.js:173`
  - `DELETE /api/licenses/:id` remove DL and Cloudinary asset. `routes/LicenseRoutes.js:201`

- Aadhaar
  - `POST /api/aadhar/upload` upload Aadhaar for `driverId`. `routes/AadharRoutes.js:39`
  - `GET /api/aadhar` list drivers with Aadhaar. `routes/AadharRoutes.js:140`
  - `PUT /api/aadhar/:id` update Aadhaar extracted fields. `routes/AadharRoutes.js:164`
  - `DELETE /api/aadhar/:id` remove Aadhaar and Cloudinary asset. `routes/AadharRoutes.js:192`

- Vehicles
  - `POST /api/vehicles` add/update vehicle and any subset of docs. `routes/VehicleRoutes.js:68`
  - `GET /api/vehicles` list vehicles. `routes/VehicleRoutes.js:168`
  - `DELETE /api/vehicles/:id` delete vehicle and all Cloudinary assets. `routes/VehicleRoutes.js:181`

## Admin APIs (Protected)

- `GET /api/admin/owners` list all cab owners with driver/vehicle counts. `routes/AdminRoutes.js:5`
- `GET /api/admin/owners/:id` get selected owner’s profile and their data. `routes/AdminRoutes.js:21`

## Frontend Pages & Scripts

- Admin Login: `public/admin-login.html` with login flow in `public/auth.js:14` → redirects to `admin-dashboard.html` on success.
- Owner Signup: `public/owner-signup.html` with phone sanitization and server signup. `public/auth.js:34`
- Owner Login: `public/owner-login.html` with server login → `owner-dashboard.html`. `public/auth.js:51`
- Owner Dashboard: Full extractor UI; only owner’s data is fetched.
  - Page: `public/owner-dashboard.html:1`
  - Driver select and save: `public/app.js:127`, `public/app.js:882`
  - DL upload/list/table: `public/app.js:412`, `public/app.js:668`, `public/app.js:521`
  - Aadhaar upload/list/table: `public/app.js:479`, `public/app.js:775`, `public/app.js:640`
  - Vehicles registry upload/list/table: `public/app.js:441`, `public/app.js:709`, `public/app.js:733`
  - Tab switching: `public/app.js:847`
  - Theme toggle: `public/app.js:949`
  - Logout: wired in page to `/auth/logout`. `public/owner-dashboard.html:193`
- Admin Dashboard: list owners, inline details view. `public/admin.js:60`

## Security Rules (Firestore)

- Rules file: `firebase/firestore.rules:1`
- Owners can only access their own documents via `request.auth.uid == ownerId`.
- Admin has full read/write via `request.auth.token.role == 'admin'`.
- Suggested deployment via Firebase CLI or Console.

## Validation & Isolation Guarantees

- Session cookie verified on every owner/admin API. `middleware/authMiddleware.js:16`, `middleware/authMiddleware.js:49`
- All Firestore reads/writes use `cabOwners/{req.ownerId}`; no global collections referenced (verified search across repo).
- Cloudinary assets stored in owner‑namespaced paths.
- Rate limiting applied on `/api`. `server.js:49`
- Helmet and CORS enabled. `server.js:24`, `server.js:39`

## Error Handling & Edge Cases

- Owner signup phone sanitized to 10 digits; fallback to create user without phone if invalid. `routes/AuthRoutes.js:19`, `routes/AuthRoutes.js:28`
- Upload endpoints return 503 if Cloudinary credentials missing. `routes/LicenseRoutes.js:51`, `routes/AadharRoutes.js:47`
- OCR failures are logged; system continues with uploads saved and empty `extractedData`. `routes/LicenseRoutes.js:104`, `routes/AadharRoutes.js:100`, `routes/VehicleRoutes.js:61`
- Owner API returns 401 if session cookie missing/invalid; 403 if owner not registered. `middleware/authMiddleware.js:31`, `middleware/authMiddleware.js:40`

## Deployment & Operations

- Start server: `npm start` → `server.js:80`
- Visit health: `GET /health` → `server.js:58`
- Configure Firebase web client via `GET /config/firebase.json`. `server.js:68`
- Deploy Firestore rules: `firebase/firestore.rules`

## Feature Index (Complete)

- Admin vs Owner separation and custom claims
- Owner signup/login and session cookie creation
- Admin login with verification against `admins` collection
- Owner‑scoped drivers CRUD
- Owner DL upload/OCR/list/edit/delete
- Owner Aadhaar upload/OCR/list/edit/delete
- Owner vehicles add/OCR/list/delete with nested document set
- Cloudinary storage and deletion for all assets
- Gemini OCR used with strict JSON schemas
- Owner Dashboard UI with driver selection, tabs, tables, theme toggle
- Admin Dashboard owner listing and details
- Firestore security rules enforcing isolation
- Helmet, CORS, rate limiting
- Firebase client config endpoint
- Health check endpoint
- Removal of old/global collection usage (drivers/vehicles at root)

## Notes

- Police Verification and Contract tabs currently show placeholder messages in `public/app.js:507`, `public/app.js:514`. They can be implemented analogously to Aadhaar/DL with dedicated extraction schemas and endpoints.

