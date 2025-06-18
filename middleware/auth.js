
// This file represent the Middleware of the AuthJs.

const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req,res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied, No token provided.'
            });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '');
        const user = await User.findById(decoded.userId).select('-password');

        if (!user || !user.isActive) {
            return res.status(401).json({
                success:false,
                message: 'Invalid Token or User not active'
            })
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid Token'
        });
    }
    };

    module.exports = auth;



