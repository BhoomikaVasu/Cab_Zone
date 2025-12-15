# 🚀 CabDoc - Complete System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    CABDOC PLATFORM                           │
│           Digital Fleet Document Manager                     │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┴───────────────────┐
        │                                       │
┌───────▼────────┐                    ┌────────▼────────┐
│   FRONTEND     │◄──────REST API────►│    BACKEND      │
│  React + Vite  │                    │  Node.js/Express│
└────────────────┘                    └─────────────────┘
                                               │
                ┌──────────────────────────────┼──────────────┐
                │                              │              │
        ┌───────▼────────┐          ┌─────────▼────────┐    │
        │   MongoDB      │          │  AWS S3/Firebase │    │
        │   Database     │          │  File Storage    │    │
        └────────────────┘          └──────────────────┘    │
                                                             │
                                    ┌────────────────────────┘
                                    │
                        ┌───────────┴──────────┐
                        │                      │
                ┌───────▼────────┐    ┌───────▼────────┐
                │  AuthBridge    │    │  Notification  │
                │  KYC/DL API    │    │  Email/SMS     │
                └────────────────┘    └────────────────┘
```

## Authentication Flow

```
User Login
    │
    ▼
┌─────────────────────┐
│  Universal Login    │
│  • Username         │
│  • Password         │
└──────────┬──────────┘
           │
           ▼
    Verify Credentials
    Check Role
    Generate JWT Token
           │
           ├─────────────┬─────────────┐
           │             │             │
    role='owner'   role='driver'  role='admin'
           │             │             │
           ▼             ▼             ▼
    Owner Dash    Driver Dash    Admin Dash
```

## User Roles & Permissions

**CAB OWNER:**
- ✅ Create/Manage Drivers
- ✅ View All Documents
- ✅ Verify/Reject Documents
- ✅ Manage Vehicles
- ✅ Generate Reports
- ✅ Send Notifications

**DRIVER:**
- ✅ View Own Profile
- ✅ Upload Documents
- ✅ View Document Status
- ✅ Receive Notifications
- ❌ Cannot View Other Drivers
- ❌ Cannot Verify Documents

## Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  username: String,
  password: String (hashed),
  role: "owner" | "driver" | "admin",
  fleet_id: ObjectId,
  created_at: Date
}
```

### Drivers Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  fleet_id: ObjectId,
  name: String,
  phone: String,
  email: String,
  dl_number: String,
  vehicle_id: ObjectId,
  compliance_score: Number,
  documents: [ObjectId]
}
```

### Documents Collection
```javascript
{
  _id: ObjectId,
  driver_id: ObjectId,
  document_type: String,
  document_number: String,
  file_url: String,
  upload_date: Date,
  expiry_date: Date,
  verification_status: "pending" | "verified" | "rejected",
  verified_by: ObjectId,
  verification_method: "manual" | "authbridge" | "ocr"
}
```

### Vehicles Collection
```javascript
{
  _id: ObjectId,
  fleet_id: ObjectId,
  registration_no: String,
  model: String,
  assigned_driver: ObjectId,
  documents: {
    rc: ObjectId,
    insurance: ObjectId,
    fitness: ObjectId,
    permit: ObjectId
  }
}
```

## API Endpoints

### Authentication
- POST `/api/auth/login` - User login
- POST `/api/auth/logout` - User logout
- GET `/api/auth/verify` - Verify JWT token

### Owner APIs
- POST `/api/owner/drivers/create` - Add new driver
- GET `/api/owner/drivers` - Get all drivers
- GET `/api/owner/dashboard/stats` - Dashboard statistics
- PUT `/api/documents/:id/verify` - Verify document
- GET `/api/reports/compliance` - Generate reports

### Driver APIs
- GET `/api/driver/profile` - Get own profile
- POST `/api/driver/documents/upload` - Upload document
- GET `/api/driver/documents` - Get own documents
- GET `/api/driver/notifications` - Get notifications

## Document Verification Flow

```
Driver Uploads Document
         │
         ▼
Stored in S3/Firebase
         │
         ▼
Document Record Created (status: pending)
         │
         ▼
Owner Notified
         │
         ▼
Owner Reviews Document
         │
         ├─────────────┬─────────────┐
         │             │             │
    Manual Review  AuthBridge   OCR Extract
         │             │             │
         └─────────────┴─────────────┘
                       │
                       ▼
            Approve / Reject
                       │
                       ▼
            Driver Notified
```

## Integration Points

### AuthBridge API
```javascript
POST /api/verification/authbridge
{
  document_type: "driving_license",
  dl_number: "DL-0120210012345",
  dob: "1990-05-15"
}

Response: {
  verified: true,
  name: "RAJESH KUMAR",
  validity: "2030-05-15"
}
```

### File Storage (AWS S3)
```javascript
// Upload
PUT /bucket-name/documents/dl_456.pdf

// Access
GET https://s3.amazonaws.com/bucket-name/documents/dl_456.pdf
```

### Notification Service
```javascript
// Email
POST /api/notifications/email
{
  to: "driver@example.com",
  subject: "Document Verified",
  body: "Your DL has been verified"
}

// SMS
POST /api/notifications/sms
{
  to: "+919876543210",
  message: "Your DL has been verified"
}
```

## Technology Stack

**Frontend:**
- React 18.3
- Vite 5.2
- TailwindCSS 3.4
- Framer Motion
- Recharts

**Backend:**
- Node.js 18+
- Express.js 4.x
- MongoDB 6.x
- JWT Authentication
- Multer (file upload)

**Storage:**
- AWS S3 / Firebase Storage
- MongoDB GridFS (backup)

**External Services:**
- AuthBridge (KYC verification)
- Twilio (SMS)
- SendGrid (Email)
- Tesseract (OCR)

## Security Features

- JWT token-based authentication
- Role-based access control (RBAC)
- Password hashing (bcrypt)
- File upload validation
- Rate limiting
- CORS protection
- XSS prevention
- SQL injection prevention

## Scalability Considerations

- Microservices architecture ready
- Horizontal scaling support
- CDN for static assets
- Database indexing
- Caching layer (Redis)
- Load balancing
- Message queue (RabbitMQ/Kafka)

See IMPLEMENTATION_GUIDE.md for detailed setup instructions.
