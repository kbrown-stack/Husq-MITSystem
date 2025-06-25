const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlenght: 3,
        maxlenght: 25
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,  'Please enter a valid email address']
    },

    password: {
        type: String,
        required: true,
        minlenght: 5
    },

    firstName: {
        type: String,
        required: true,
        trim: true
    },

    lastName: {
        type: String,
        required: true,
        trim: true
    },

    role: {
        type: String,
        enum: ['admin', 'software', 'technician', 'operator'],
        default: 'operator'
    },

    department: {
        type: String,
        trim: true
    },

    employeeId: {
        type: String,
        unique: true,
        sparse: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    lastLogin: {
        type: Date
    },
     
    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now

    }
});

module.exports = mongoose.model('User', userSchema);