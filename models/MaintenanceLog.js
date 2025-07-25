const mongoose = require('mongoose');

const maintenanceLogSchema = new mongoose.Schema({
machine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Machine',
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
    ref: 'User',
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
    enum: [ 'scheduled','completed', 'in_progress'],
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

});

// The Indexes (This helps to improve and speed the process of reading and quering when searching for large colelctions in the DB)

maintenanceLogSchema.index({ machine: 1, createdAt: -1 });  // This finds the logs for a particular machine and sort them out by recent once.
maintenanceLogSchema.index({ technician: 1 }); // This speed up the query when you need to fetch logs assigned to a particular tecchnician or user.
maintenanceLogSchema.index({ status: 1 }); // This improves perfermance when filtring maintenace status.
maintenanceLogSchema.index({ scheduleDate: 1}); // This is for checking the scheduled event by date.


// The Auto-update updatedAt ( This helps keeps track on when the document was last chnaged by runnung an auto updateAT in the DB)

maintenanceLogSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Auto-calculate total cost ( This calculates the total maintenance cost authomatically before saving a log.)

maintenanceLogSchema.pre('save', function (next) {
    let partsCost = 0;
    if (this.partsUsed && this.partsUsed.length > 0) {
        partsCost = this.partsUsed.reduce((total, part) => {
            return total + (part.cost * part.quantity || 0);
        }, 0);
    }
    this.totalCost = partsCost + (this.laborCost || 0);
    next()
});



module.exports = mongoose.model('MaintenanceLog', maintenanceLogSchema);
