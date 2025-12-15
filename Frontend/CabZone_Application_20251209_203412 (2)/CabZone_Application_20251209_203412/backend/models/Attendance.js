const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    driverId: {
        type: String,
        required: true,
        index: true
    },
    date: {
        type: String, // Format: YYYY-MM-DD
        required: true,
        index: true
    },
    status: {
        type: String,
        enum: ['present', 'absent', null],
        default: null
    },
    markedAt: {
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

// Compound index for efficient queries
attendanceSchema.index({ driverId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
