const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'machine',
    required: true
},

type: {
    type: String,
    enum: ['reimage', 'newbuild'],
    required: true
},

priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'critical'
},

title: {
type: String,
required: true,
trim: true
},

description: {
    type: String,
    required: true
},

software: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true
},

scheduleDate: {
    type: Date,
    required: true
},

startDate: {
    type: Date
},

completionDate: {
    type: Date
},

estimatedDuration: {
    type: Number,  // this should be in hours.
    min: 0
},

actualDuration: {
    type: Number,
    min: 0
},

status: {
    type: String,
    enum: ['completed', 'in_progress'],
    default:'scheduled'
},

isActive: {
    type: Boolean,
    default: true
},

createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
},

updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
