const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        default: ''
    },
    licenseNo: {
        type: String,
        default: ''
    },
    vehicle: {
        type: String,
        default: ''
    },
    dob: {
        type: String,
        default: ''
    },
    doi: {
        type: String,
        default: ''
    },
    licenseExpiry: {
        type: String,
        default: ''
    },
    joinDate: {
        type: String,
        default: ''
    },
    address: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'suspended'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Driver', driverSchema);
