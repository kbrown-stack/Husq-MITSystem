const mongoose = require('mongoose');

const machineSchema = new mongoose.Schema({
    machineId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    name: {
        type: String,
        required: true,
        trim: true
    },

    type: {
        type: String,
        required: true,
        enum: ['Desktop', 'Laptop', 'Tablet', 'Mini pc', 'Other ']
    }, 

    manufacturer: {
        type: String,
        required: true,
        trim: true
    },

    profile: {
        type: String,
        required: true
    },

    isActive: {
        type: Boolean,
        default: true
    },

    // model: {
    //     type: String,
    //     required: true,
    //     trim: true
    // },

    // serialNumber: {
    //     type: String,
    //     required: true,
    //     unique: true,
    //     trim: true
    // }, 

    specifications: {
        power: String,
        weight: String,
        dimensions: {
            length: String,
            width: String,
            height: String
        },
        capacity: String,
        speed: String,
        accuracy: String,
        additionalSpecs: [{
            key: String,
            value: String
        }]
    },

    builtDate: {
        type: Date,
        required: true
    },

    buildDate: {
        type: Date
    },

    // warrantyExpiry: {
    //     type: Date
    // }, 

    // cost: {
    //     type: Number,
    //     min: 0
    // },

    location: {
        building: String,
        floor: String,
        room: String,
        coordinates: {
            x: Number,
            y: Number
        }
    },

    status: {
        type: String,
        enum: ['ready', 'rebuild', 'updating'],
        default: 'ready'
    },

    assignedUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },

    assignedDate: {
        type: Date
    },

    barcode: {
        type: String,
        unique: true,
        sparse: true
    },

    qrcode: {
        type: String,
        unique: true,
        sparse: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    updatedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },

    createdAt: {
        type: Date,
        default: Date.now
    },

    updatedAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Machine', machineSchema)
