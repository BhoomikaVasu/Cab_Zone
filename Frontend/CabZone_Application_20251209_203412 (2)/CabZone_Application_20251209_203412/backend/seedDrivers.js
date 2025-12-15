const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Driver Schema
const driverSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    licenseNo: { type: String, default: '' },
    vehicle: { type: String, default: '' },
    dob: { type: String, default: '' },
    doi: { type: String, default: '' },
    licenseExpiry: { type: String, default: '' },
    joinDate: { type: String, default: '' },
    address: { type: String, default: '' },
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
}, { timestamps: true });

const Driver = mongoose.model('Driver', driverSchema);

// Sample drivers data
const sampleDrivers = [
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

// Insert sample drivers
async function seedDrivers() {
    try {
        // Clear existing drivers (optional - comment out if you want to keep existing data)
        await Driver.deleteMany({});
        console.log('Cleared existing drivers');

        // Insert sample drivers
        const result = await Driver.insertMany(sampleDrivers);
        console.log(`Successfully inserted ${result.length} sample drivers`);

        // Display inserted drivers
        result.forEach(driver => {
            console.log(`- ${driver.name} (${driver.id}) - ${driver.phone}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error seeding drivers:', error);
        process.exit(1);
    }
}

// Run the seed function
seedDrivers();
