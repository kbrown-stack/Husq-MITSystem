const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 25
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
        minlength: 5
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

// To Hash password before saving (This makes the actual password invisble to detect)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) 
        return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }

})

// This is to compare the password

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}



module.exports = mongoose.model('User', userSchema);