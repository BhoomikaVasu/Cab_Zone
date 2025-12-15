# 🔗 CabDoc - Complete Integration Guide (Owner + Driver)

## 🎯 System Integration Overview

This guide shows how to integrate the Driver Dashboard with your existing Owner Dashboard to create a complete dual-role system.

---

## 📊 Complete Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CABDOC UNIFIED SYSTEM                             │
└─────────────────────────────────────────────────────────────────────┘

                         www.cabdoc.com
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Universal Login    │
                    │   ─────────────────  │
                    │   Username: ______   │
                    │   Password: ______   │
                    │   [Login]            │
                    └──────────┬───────────┘
                               │
                               ▼
                    Backend Authentication
                    Check role in database
                               │
                ┌──────────────┼──────────────┐
                │              │              │
         role='owner'   role='driver'   role='admin'
                │              │              │
                ▼              ▼              ▼
    ┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
    │ OWNER DASHBOARD  │ │   DRIVER     │ │    ADMIN     │
    │ /owner/dashboard │ │  DASHBOARD   │ │   PANEL      │
    │                  │ │ /driver/dash │ │ /admin/dash  │
    └────────┬─────────┘ └──────┬───────┘ └──────────────┘
             │                  │
             └──────────┬───────┘
                        │
                        ▼
            ┌───────────────────────┐
            │   SHARED BACKEND      │
            │   Node.js + Express   │
            │   REST API            │
            └───────────┬───────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
        ▼               ▼               ▼
┌──────────────┐ ┌──────────┐ ┌────────────────┐
│   MongoDB    │ │  AWS S3  │ │   External     │
│   Database   │ │  Files   │ │   Services     │
└──────────────┘ └──────────┘ │ • Twilio (SMS) │
                               │ • SendGrid     │
                               │ • AuthBridge   │
                               └────────────────┘
```

---

## 🔐 Step 1: Update App.jsx for Role-Based Routing

```javascript
// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/shared/Login';
import OwnerDashboard from './components/owner/OwnerDashboard';
import DriverDashboard from './components/driver/DriverDashboard';
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="text-2xl">Loading...</div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

// Role-based redirect component
const RoleBasedRedirect = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;

  switch (user.role) {
    case 'owner':
      return <Navigate to="/owner/dashboard" />;
    case 'driver':
      return <Navigate to="/driver/dashboard" />;
    case 'admin':
      return <Navigate to="/admin/dashboard" />;
    default:
      return <Navigate to="/login" />;
  }
};

function AppContent() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RoleBasedRedirect />} />

      {/* Owner Routes */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Driver Routes */}
      <Route
        path="/driver/dashboard"
        element={
          <ProtectedRoute allowedRoles={['driver']}>
            <DriverDashboard />
          </ProtectedRoute>
        }
      />

      {/* Unauthorized */}
      <Route path="/unauthorized" element={
        <div className="min-h-screen flex items-center justify-center">
          <div className="glass-card p-8 text-center">
            <h1 className="text-3xl font-bold text-red-400 mb-4">Access Denied</h1>
            <p className="text-gray-400">You don't have permission to access this page.</p>
          </div>
        </div>
      } />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
```

---

## 🔑 Step 2: Update AuthContext for Role Management

```javascript
// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const { data } = await api.get('/auth/verify');
        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('token');
        setUser(null);
      }
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data.user;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 🔄 Step 3: Backend Authentication with Role Detection

```javascript
// backend/src/controllers/authController.js
const User = require('../models/User');
const Driver = require('../models/Driver');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findOne({ username }).populate('fleet_id');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    // Check if active
    if (user.status !== 'active') {
      return res.status(403).json({ 
        success: false, 
        message: 'Account is inactive' 
      });
    }

    // Update last login
    user.last_login = new Date();
    await user.save();

    // Generate JWT token with role
    const token = jwt.sign(
      { 
        id: user._id, 
        role: user.role,
        fleet_id: user.fleet_id 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Prepare user data based on role
    let userData = {
      id: user._id,
      username: user.username,
      role: user.role,
      fleet_id: user.fleet_id
    };

    // If driver, get driver profile
    if (user.role === 'driver') {
      const driver = await Driver.findOne({ user_id: user._id })
        .populate('vehicle_id')
        .populate('fleet_id', 'fleet_name');
      
      userData.driver_info = {
        driver_id: driver._id,
        name: driver.personal_info.name,
        phone: driver.personal_info.phone,
        vehicle: driver.vehicle_id?.registration_no,
        owner_name: driver.fleet_id?.fleet_name,
        compliance_score: driver.compliance_score
      };
    }

    res.json({
      success: true,
      token,
      user: userData
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
};
```

---

## 📊 Step 4: Driver-Specific API Endpoints

```javascript
// backend/src/routes/driver.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const driverController = require('../controllers/driverController');

// All routes require authentication and driver role
router.use(auth);
router.use(roleCheck(['driver']));

// Dashboard
router.get('/dashboard/stats', driverController.getDashboardStats);

// Documents
router.get('/documents', driverController.getMyDocuments);
router.post('/documents/upload', driverController.uploadDocument);
router.get('/documents/:id', driverController.getDocument);
router.delete('/documents/:id', driverController.deleteDocument);

// Notifications
router.get('/notifications', driverController.getNotifications);
router.put('/notifications/:id/read', driverController.markNotificationRead);

// Messages
router.get('/messages', driverController.getMessages);
router.post('/messages/send', driverController.sendMessage);

// Profile
router.get('/profile', driverController.getProfile);
router.put('/profile/update', driverController.updateProfile);
router.put('/profile/change-password', driverController.changePassword);

module.exports = router;
```

```javascript
// backend/src/controllers/driverController.js
const Driver = require('../models/Driver');
const Document = require('../models/Document');
const Notification = require('../models/Notification');

exports.getDashboardStats = async (req, res) => {
  try {
    const driver_id = req.user.driver_id;

    const documents = await Document.find({ driver_id });

    const stats = {
      verified: documents.filter(d => d.verification_status === 'verified').length,
      pending: documents.filter(d => d.verification_status === 'pending').length,
      expiring: documents.filter(d => d.isExpiringSoon()).length,
      total: documents.length
    };

    const driver = await Driver.findById(driver_id);

    res.json({
      success: true,
      stats,
      compliance_score: driver.compliance_score
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getMyDocuments = async (req, res) => {
  try {
    const driver_id = req.user.driver_id;

    const documents = await Document.find({ driver_id })
      .sort({ upload_date: -1 });

    res.json({
      success: true,
      documents
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.uploadDocument = async (req, res) => {
  try {
    const { document_type, document_number, expiry_date } = req.body;
    const file = req.file;
    const driver_id = req.user.driver_id;
    const fleet_id = req.user.fleet_id;

    // Upload to S3
    const fileUrl = await uploadToS3(file, `documents/${driver_id}/${document_type}`);

    // Create document
    const document = await Document.create({
      fleet_id,
      driver_id,
      document_type,
      document_number,
      file_url: fileUrl,
      expiry_date: expiry_date ? new Date(expiry_date) : null,
      verification_status: 'pending'
    });

    // Notify owner
    await createNotification(fleet_id, 'owner', {
      type: 'new_document',
      title: 'New Document Uploaded',
      message: `Driver uploaded ${document_type}`,
      related_document_id: document._id
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      document
    });

  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
```

---

## 🔄 Step 5: Real-Time Synchronization

```javascript
// backend/src/services/websocket.js
const socketIO = require('socket.io');

let io;

const initializeWebSocket = (server) => {
  io = socketIO(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Join room based on user role and fleet
    socket.on('join', ({ user_id, role, fleet_id }) => {
      socket.join(`fleet_${fleet_id}`);
      socket.join(`user_${user_id}`);
      console.log(`User ${user_id} joined fleet ${fleet_id}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};

// Emit events
const emitToFleet = (fleet_id, event, data) => {
  if (io) {
    io.to(`fleet_${fleet_id}`).emit(event, data);
  }
};

const emitToUser = (user_id, event, data) => {
  if (io) {
    io.to(`user_${user_id}`).emit(event, data);
  }
};

module.exports = {
  initializeWebSocket,
  emitToFleet,
  emitToUser
};
```

```javascript
// Frontend WebSocket connection
// src/services/websocket.js
import io from 'socket.io-client';

let socket;

export const connectWebSocket = (user) => {
  socket = io(process.env.REACT_APP_API_URL);

  socket.on('connect', () => {
    console.log('WebSocket connected');
    socket.emit('join', {
      user_id: user.id,
      role: user.role,
      fleet_id: user.fleet_id
    });
  });

  socket.on('document_uploaded', (data) => {
    // Refresh owner dashboard
    console.log('New document uploaded:', data);
  });

  socket.on('document_verified', (data) => {
    // Refresh driver dashboard
    console.log('Document verified:', data);
  });

  return socket;
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
  }
};
```

---

## 📱 Step 6: Update Login Component

```javascript
// src/components/shared/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Car, Lock, User } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(username, password);
      
      // Role-based redirect
      if (user.role === 'owner') {
        navigate('/owner/dashboard');
      } else if (user.role === 'driver') {
        navigate('/driver/dashboard');
      } else if (user.role === 'admin') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="glass-card p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
            <Car size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text">CabDoc</h1>
          <p className="text-gray-400 mt-2">Digital Fleet Document Manager</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User size={16} className="inline mr-2" />
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="glass-input w-full"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Lock size={16} className="inline mr-2" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass-input w-full"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-6">
          Secure login • Role-based access
        </p>
      </div>
    </div>
  );
};

export default Login;
```

---

## ✅ Integration Checklist

### Backend Setup
- [ ] Create User model with role field
- [ ] Create Driver model linked to User
- [ ] Implement JWT authentication
- [ ] Add role-based middleware
- [ ] Create driver-specific API endpoints
- [ ] Setup WebSocket for real-time updates
- [ ] Configure file upload to S3

### Frontend Setup
- [ ] Install React Router
- [ ] Create AuthContext
- [ ] Create ProtectedRoute component
- [ ] Build Driver Dashboard
- [ ] Update App.jsx with routes
- [ ] Connect WebSocket
- [ ] Add role-based navigation

### Testing
- [ ] Test owner login → redirects to owner dashboard
- [ ] Test driver login → redirects to driver dashboard
- [ ] Test document upload from driver
- [ ] Test real-time notification to owner
- [ ] Test document verification by owner
- [ ] Test real-time update to driver
- [ ] Test unauthorized access prevention

---

## 🚀 Deployment

Your complete system is now ready with:
- ✅ Universal login
- ✅ Role-based routing
- ✅ Owner Dashboard (existing)
- ✅ Driver Dashboard (new)
- ✅ Shared backend
- ✅ Real-time synchronization
- ✅ Secure authentication

**Both dashboards work together seamlessly!**
