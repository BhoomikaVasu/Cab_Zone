# 🎨 CabDoc - Visual System Flowchart

## Complete User Journey & Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CABDOC PLATFORM                              │
│                  Digital Fleet Document Manager                      │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                        1. LOGIN FLOW                                 │
└─────────────────────────────────────────────────────────────────────┘

    User visits: www.cabdoc.com
              │
              ▼
    ┌─────────────────────┐
    │  Universal Login    │
    │  ─────────────────  │
    │  Username: _______  │
    │  Password: _______  │
    │  [Login Button]     │
    └──────────┬──────────┘
               │
               ▼
    POST /api/auth/login
    { username, password }
               │
               ▼
    ┌──────────────────────────────┐
    │  Backend Authentication      │
    │  ──────────────────────────  │
    │  1. Find user in database    │
    │  2. Verify password (bcrypt) │
    │  3. Check user status        │
    │  4. Get user role            │
    │  5. Generate JWT token       │
    └──────────┬───────────────────┘
               │
               ├─────────────┬─────────────┐
               │             │             │
        role='owner'   role='driver'  role='admin'
               │             │             │
               ▼             ▼             ▼
    ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
    │ Redirect to  │ │ Redirect to  │ │ Redirect to  │
    │ /owner/dash  │ │ /driver/dash │ │ /admin/dash  │
    └──────────────┘ └──────────────┘ └──────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  2. CAB OWNER DASHBOARD FLOW                         │
└─────────────────────────────────────────────────────────────────────┘

Owner Dashboard Loads
         │
         ▼
GET /api/owner/dashboard/stats
         │
         ▼
Backend Aggregates:
├─ Total Drivers (from Drivers collection)
├─ Active Vehicles (from Vehicles collection)
├─ Pending Documents (status='pending')
├─ Verified Documents (status='verified')
├─ Expiring Soon (expiry_date < 30 days)
└─ Recent Activity (last 10 actions)
         │
         ▼
Display Dashboard Cards:
┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐
│  45  │ │  38  │ │  12  │ │ 156  │ │  8   │
│Driver│ │Vehic.│ │Pend. │ │Verif.│ │Expir.│
└──────┘ └──────┘ └──────┘ └──────┘ └──────┘

┌─────────────────────────────────────────────────────────────────────┐
│                  3. ADD DRIVER FLOW (Owner)                          │
└─────────────────────────────────────────────────────────────────────┘

Owner clicks "Add Driver"
         │
         ▼
Modal opens with form:
┌─────────────────────────┐
│ Name: _______________   │
│ Phone: ______________   │
│ Email: ______________   │
│ DL No: ______________   │
│ Vehicle: [Dropdown]     │
│ [Submit] [Cancel]       │
└──────────┬──────────────┘
           │
           ▼
POST /api/owner/drivers/create
{
  name: "Rajesh Kumar",
  phone: "+919876543210",
  email: "rajesh@example.com",
  dl_number: "DL-0120210012345",
  vehicle_id: "vehicle_123"
}
           │
           ▼
Backend Processing:
├─ 1. Check if DL exists
├─ 2. Generate username: rajesh_kumar_001
├─ 3. Generate password: CabDoc@2024Raj
├─ 4. Create User record (role='driver')
├─ 5. Create Driver record
├─ 6. Send SMS with credentials
└─ 7. Send Email with credentials
           │
           ▼
Response:
{
  success: true,
  driver_id: "driver_456",
  credentials: {
    username: "rajesh_kumar_001",
    password: "CabDoc@2024Raj"
  }
}
           │
           ▼
Owner sees success message:
"Driver added! Credentials sent to phone."
           │
           ▼
Driver receives SMS:
"Welcome to CabDoc!
Username: rajesh_kumar_001
Password: CabDoc@2024Raj
Login: www.cabdoc.com"

┌─────────────────────────────────────────────────────────────────────┐
│                  4. DRIVER DASHBOARD FLOW                            │
└─────────────────────────────────────────────────────────────────────┘

Driver logs in with credentials
         │
         ▼
GET /api/driver/profile
         │
         ▼
Backend returns:
├─ Personal info
├─ Assigned vehicle
├─ Document list
├─ Compliance score
└─ Notifications
         │
         ▼
Display Driver Dashboard:
┌─────────────────────────────────┐
│ Rajesh Kumar                    │
│ DL: DL-0120210012345           │
│ Vehicle: MH-01-AB-1234         │
│ Compliance: 85%                 │
│                                 │
│ My Documents:                   │
│ ✅ Driving License (Verified)  │
│ ⏳ Aadhaar (Pending)           │
│ ❌ PAN Card (Missing)          │
│                                 │
│ [Upload Document]               │
└─────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│              5. DOCUMENT UPLOAD FLOW (Driver)                        │
└─────────────────────────────────────────────────────────────────────┘

Driver clicks "Upload Document"
         │
         ▼
Modal opens:
┌─────────────────────────────┐
│ Document Type: [Dropdown]   │
│ • Driving License           │
│ • Aadhaar Card             │
│ • PAN Card                 │
│                            │
│ Document No: ____________  │
│ Expiry Date: [Date]        │
│                            │
│ [Drag & Drop File]         │
│ or [Browse]                │
│                            │
│ [Upload] [Cancel]          │
└──────────┬──────────────────┘
           │
           ▼
POST /api/driver/documents/upload
FormData: {
  document_type: "aadhaar",
  document_number: "1234-5678-9012",
  expiry_date: null,
  file: <binary>
}
           │
           ▼
Backend Processing:
├─ 1. Validate file (type, size)
├─ 2. Upload to AWS S3
│     └─ s3://cabdoc/documents/driver_456/aadhaar.pdf
├─ 3. Create Document record
│     └─ status: 'pending'
├─ 4. Add to Driver's documents array
├─ 5. Notify owner
└─ 6. Optional: Run OCR extraction
           │
           ▼
Response:
{
  success: true,
  document_id: "doc_789",
  file_url: "s3://...",
  status: "pending_verification"
}
           │
           ▼
Driver sees: "Document uploaded! Awaiting verification."
           │
           ▼
Owner receives notification:
"New Aadhaar uploaded by Rajesh Kumar"

┌─────────────────────────────────────────────────────────────────────┐
│            6. DOCUMENT VERIFICATION FLOW (Owner)                     │
└─────────────────────────────────────────────────────────────────────┘

Owner navigates to "Verify Documents"
         │
         ▼
GET /api/owner/documents?status=pending
         │
         ▼
Display pending documents:
┌─────────────────────────────────────────┐
│ Driver: Rajesh Kumar                    │
│ Document: Aadhaar Card                  │
│ Number: 1234-5678-9012                 │
│ Uploaded: 2024-10-26 14:30             │
│                                         │
│ [View PDF] [Verify with AuthBridge]    │
│ [Approve] [Reject]                      │
└──────────┬──────────────────────────────┘
           │
           ├─────────────────┐
           │                 │
    Manual Review    AuthBridge Verify
           │                 │
           │                 ▼
           │    POST /api/verification/authbridge
           │    {
           │      document_type: "aadhaar",
           │      aadhaar_number: "1234-5678-9012"
           │    }
           │                 │
           │                 ▼
           │    AuthBridge API Response:
           │    {
           │      verified: true,
           │      name: "RAJESH KUMAR",
           │      dob: "1990-05-15",
           │      address: "..."
           │    }
           │                 │
           └─────────────────┘
                    │
                    ▼
Owner clicks "Approve"
                    │
                    ▼
PUT /api/documents/doc_789/verify
{
  status: "verified",
  comments: "Auto-verified via AuthBridge",
  use_authbridge: true
}
                    │
                    ▼
Backend Processing:
├─ 1. Update document status
├─ 2. Record verification details
├─ 3. Update driver compliance score
└─ 4. Send notification to driver
                    │
                    ▼
Driver receives notification:
"Your Aadhaar Card has been verified ✅"
                    │
                    ▼
Driver Dashboard updates:
✅ Aadhaar Card (Verified)
Compliance Score: 85% → 92%

┌─────────────────────────────────────────────────────────────────────┐
│                  7. DATA CONNECTIONS                                 │
└─────────────────────────────────────────────────────────────────────┘

MongoDB Collections Relationships:

Users ──────┐
            ├──► Drivers ──────┐
Fleets ─────┘                  ├──► Documents
                               │
Vehicles ──────────────────────┘

Fleet (Owner's Company)
  │
  ├─► Users (Owner + All Drivers)
  │     └─► Authentication & Login
  │
  ├─► Drivers (Driver Profiles)
  │     ├─► Personal Info
  │     ├─► License Info
  │     └─► Compliance Score
  │
  ├─► Vehicles (Fleet Vehicles)
  │     ├─► Registration Details
  │     └─► Assigned Driver
  │
  └─► Documents (All Documents)
        ├─► Driver Documents
        ├─► Vehicle Documents
        └─► Verification Status

┌─────────────────────────────────────────────────────────────────────┐
│              8. REAL-TIME UPDATES & NOTIFICATIONS                    │
└─────────────────────────────────────────────────────────────────────┘

Event: Driver uploads document
         │
         ▼
Backend triggers:
├─ 1. WebSocket event to Owner dashboard
├─ 2. Push notification to Owner
├─ 3. Email notification to Owner
└─ 4. Update dashboard stats
         │
         ▼
Owner Dashboard auto-refreshes:
"Pending Documents: 12 → 13"
         │
         ▼
Event: Owner verifies document
         │
         ▼
Backend triggers:
├─ 1. WebSocket event to Driver dashboard
├─ 2. SMS to Driver
├─ 3. Email to Driver
└─ 4. Update compliance score
         │
         ▼
Driver Dashboard auto-refreshes:
"Compliance Score: 85% → 92%"

┌─────────────────────────────────────────────────────────────────────┐
│                  9. INTEGRATION ARCHITECTURE                         │
└─────────────────────────────────────────────────────────────────────┘

Frontend (React)
      │
      ├──► REST API (Express.js)
      │         │
      │         ├──► MongoDB (Data Storage)
      │         │
      │         ├──► AWS S3 (File Storage)
      │         │     └─► Documents, Photos
      │         │
      │         ├──► AuthBridge API
      │         │     └─► DL/Aadhaar Verification
      │         │
      │         ├──► Twilio API
      │         │     └─► SMS Notifications
      │         │
      │         ├──► SendGrid API
      │         │     └─► Email Notifications
      │         │
      │         └──► Tesseract OCR
      │               └─► Document Text Extraction
      │
      └──► WebSocket (Socket.io)
            └─► Real-time Updates

┌─────────────────────────────────────────────────────────────────────┐
│                  10. SECURITY LAYERS                                 │
└─────────────────────────────────────────────────────────────────────┘

Request Flow:
User Request
    │
    ▼
HTTPS/SSL Encryption
    │
    ▼
CORS Validation
    │
    ▼
Rate Limiting
    │
    ▼
JWT Token Verification
    │
    ▼
Role-Based Access Control
    │
    ▼
Input Validation & Sanitization
    │
    ▼
Database Query (Parameterized)
    │
    ▼
Response Encryption
    │
    ▼
User Receives Data
```

## Summary

**CabDoc** provides a complete dual-dashboard system where:

1. **Cab Owners** can manage their entire fleet, verify documents, and monitor compliance
2. **Drivers** can upload documents, track verification status, and maintain compliance
3. **All data** flows through a secure backend with role-based access control
4. **Real-time notifications** keep both parties informed
5. **External integrations** automate verification and communication
6. **Scalable architecture** supports growth and new features

The system is production-ready and follows industry best practices for security, scalability, and user experience.
