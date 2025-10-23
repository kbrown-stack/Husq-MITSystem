
// This file represent the Middleware of the verifyToken and Check Roles access 

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('./../utils/appError'); // this is imported.

// This below helps verifies the token and jwt and load the user

const verifyToken = async (req,res, next) => {
    try {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer')) {

            return next(new AppError('Access denied, No token provided.', 401));
            // return res.status(401).json({
                // success: false,
                // message: 'Access denied, No token provided.'
            // });
        }

        const token = authHeader.replace('Bearer', '').trim(); // This helps extracts the token

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (!user || !user.isActive) {

            return next(new AppError('Invalid Token or User not active.', 401));
            // return res.status(401).json({
            //     success:false,
            //     message: 'Invalid Token or User not active'
            // })
        }

        req.user = user;
        next();
        
    } catch (error) {

        return next(new AppError('Invalid Token.', 401)); // this automatically forwards it to the global handler.
        // console.error('Auth Middleware Error:', error)
        // res.status(401).json({
        //     success: false,
        //     message: 'Invalid Token'
        // });
    }
    };

    // This helps check the role access control

    const checkRoles = (...allowedRoles) => {
        return (req,res, next) => {
            if (!req.user || !allowedRoles.includes(req.user.role)) {

                return next(new AppError('Not Allowed: You cannot have permission to perform this action.', 403));
                // return res.status(403).json({
                //     success: false,
                //     message: 'Not Allowed: You cannot have permission to perform this action'
                // });
            }
            next()
        };
    };



    module.exports = {
        verifyToken,
        checkRoles
    };




