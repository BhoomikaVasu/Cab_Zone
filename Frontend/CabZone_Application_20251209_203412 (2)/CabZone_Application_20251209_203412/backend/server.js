require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data stores (for development/testing without MongoDB)
let drivers = [
  {
    id: 'DRV001',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@example.com',
    licenseNo: 'DL-0420110012345',
    vehicle: 'MH-01-AB-1234',
    dob: '1985-05-15',
    doi: '2010-03-20',
    licenseExpiry: '2030-03-20',
    joinDate: '2020-01-15',
    address: 'Mumbai, Maharashtra',
    status: 'active'
  },
  {
    id: 'DRV002',
    name: 'Amit Sharma',
    phone: '+91 98765 43211',
    email: 'amit.sharma@example.com',
    licenseNo: 'DL-0420110012346',
    vehicle: 'MH-02-CD-5678',
    dob: '1990-08-22',
    doi: '2012-06-10',
    licenseExpiry: '2032-06-10',
    joinDate: '2021-03-10',
    address: 'Pune, Maharashtra',
    status: 'active'
  },
  {
    id: 'DRV003',
    name: 'Suresh Patil',
    phone: '+91 98765 43212',
    email: 'suresh.patil@example.com',
    licenseNo: 'DL-0420110012347',
    vehicle: 'MH-03-EF-9012',
    dob: '1988-12-05',
    doi: '2011-09-15',
    licenseExpiry: '2031-09-15',
    joinDate: '2020-06-20',
    address: 'Nagpur, Maharashtra',
    status: 'active'
  },
  {
    id: 'DRV004',
    name: 'Vikram Singh',
    phone: '+91 98765 43213',
    email: 'vikram.singh@example.com',
    licenseNo: 'DL-0420110012348',
    vehicle: 'DL-01-GH-3456',
    dob: '1992-03-18',
    doi: '2014-01-25',
    licenseExpiry: '2034-01-25',
    joinDate: '2022-01-05',
    address: 'Delhi',
    status: 'active'
  },
  {
    id: 'DRV005',
    name: 'Manoj Verma',
    phone: '+91 98765 43214',
    email: 'manoj.verma@example.com',
    licenseNo: 'DL-0420110012349',
    vehicle: 'KA-01-IJ-7890',
    dob: '1987-07-30',
    doi: '2010-11-12',
    licenseExpiry: '2030-11-12',
    joinDate: '2020-09-15',
    address: 'Bangalore, Karnataka',
    status: 'active'
  }
];

let attendanceRecords = {};

// Driver Routes
app.get('/api/drivers', (req, res) => {
  res.json(drivers);
});

app.get('/api/drivers/:id', (req, res) => {
  const driver = drivers.find(d => d.id === req.params.id);
  if (!driver) {
    return res.status(404).json({ message: 'Driver not found' });
  }
  res.json(driver);
});

app.post('/api/drivers', (req, res) => {
  const newDriver = {
    id: `DRV${String(drivers.length + 1).padStart(3, '0')}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  drivers.push(newDriver);
  res.status(201).json(newDriver);
});

app.put('/api/drivers/:id', (req, res) => {
  const index = drivers.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Driver not found' });
  }
  drivers[index] = { ...drivers[index], ...req.body, updatedAt: new Date().toISOString() };
  res.json(drivers[index]);
});

app.delete('/api/drivers/:id', (req, res) => {
  const index = drivers.findIndex(d => d.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: 'Driver not found' });
  }
  drivers.splice(index, 1);
  res.json({ message: 'Driver deleted successfully' });
});

// Attendance Routes
app.get('/api/attendance/:driverId', (req, res) => {
  const { driverId } = req.params;
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ message: 'Year and month are required' });
  }

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const driverAttendance = attendanceRecords[driverId] || {};
  const filteredAttendance = {};

  Object.keys(driverAttendance).forEach(date => {
    if (date >= startDate && date <= endDate && driverAttendance[date]) {
      filteredAttendance[date] = driverAttendance[date];
    }
  });

  res.json(filteredAttendance);
});

app.post('/api/attendance', (req, res) => {
  const { driverId, date, status } = req.body;

  if (!driverId || !date) {
    return res.status(400).json({ message: 'Driver ID and date are required' });
  }

  if (!attendanceRecords[driverId]) {
    attendanceRecords[driverId] = {};
  }

  if (status === null) {
    delete attendanceRecords[driverId][date];
    return res.json({ message: 'Attendance unmarked successfully' });
  }

  if (!['present', 'absent'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be "present" or "absent"' });
  }

  attendanceRecords[driverId][date] = status;

  res.json({
    message: 'Attendance marked successfully',
    attendance: { driverId, date, status }
  });
});

app.get('/api/attendance/:driverId/summary', (req, res) => {
  const { driverId } = req.params;
  const { year, month } = req.query;

  if (!year || !month) {
    return res.status(400).json({ message: 'Year and month are required' });
  }

  const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
  const endDate = `${year}-${String(month).padStart(2, '0')}-31`;

  const driverAttendance = attendanceRecords[driverId] || {};
  let present = 0;
  let absent = 0;

  Object.keys(driverAttendance).forEach(date => {
    if (date >= startDate && date <= endDate) {
      if (driverAttendance[date] === 'present') present++;
      if (driverAttendance[date] === 'absent') absent++;
    }
  });

  res.json({ present, absent, unmarked: 0 });
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to CabZone API',
    status: 'Running with in-memory storage',
    endpoints: {
      drivers: '/api/drivers',
      attendance: '/api/attendance'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`📝 Using in-memory storage (no MongoDB connection required)`);
  console.log(`👥 ${drivers.length} sample drivers loaded`);
  console.log(`🌐 API available at http://localhost:${PORT}`);
});
