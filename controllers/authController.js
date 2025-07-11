const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const generateToken = (userId) => {  // this serves as the payload that helps keep the token. 
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,{ expiresIn: '10d'}
    );
};

const authController = {

    // TO REGISTER USER

    register: async (req, res) => { // This enables you to register new user
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    erros: errors.array()
                });
            }
            const {username, email, password, firstName, lastName, role, department, employed } = req.body;

            const existingUser = await User.findOne({  // This helps checks if user is existing.
                $or: [{ email}, { username }]
            });

            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'User with this email or username already exists'
                });
            }

            const user = new User({ // This helps you create new User.
                username,
                email,
                password,
                firstName,
                lastName,
                role: role || 'operator',
                department,
                // employeeId
            });

            await user.save();

            const token = generateToken(user._id);

            res.status(201).json({
                success: true,
                message: ' User created successfully',
                data: {
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        department: user.department
                    }
                }
            });

        } catch (error) {
            console.error('Registration Error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during registration'

            });
        }
    },

    // To LOGIN USER

    login: async (req,res) => {  // This helps create login user.
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation error',
                    errors: errors.array()
                });
            }
            const { usernameOremail, password} = req.body;

            const user = await User.findOne({  // This helps in finding user with email or username.
                $or: [
                    { username: usernameOremail }, 
                    { email: usernameOremail }
                ],
                isActive: true
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid Login Details'
                });
            }

            const isMatch = await user.comparePassword(password); // This helps to check the password
            if (!isMatch) {
                return res.status(401).json({
                    success:false,
                    message: 'Invalid login details'
                });
            }

            user.lastLogin = new Date(); // This helps update the last user login.
            await user.save();

            const token = generateToken(user._id); // This will help generate token.

            res.json({
                success: true,
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        role: user.role,
                        department: user.department,
                        lastLogin: user.lastLogin
                    }
                }
            });

        } catch (error) {
            console.error('Login Error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error during login'

            });
        }
    },

    getProfile: async (req, res) => {  // This is helps gets the current user profile.
        try {
            const user = req.user;

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });

            }

            res.status(200).json({
                success:true,

                message: 'User profile fetched successfully',
                data: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role,
                    department: user.department,
                    lastLogin: user.lastLogin

                }
            });

        } catch (error) {
            console.error('Get profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while getting the profile'

            });
        }
    },

    updateProfile: async (req,res) => {  // This helps to update the users Profile
        try {
            const {firstName, lastName, department} = req.body;

            const user = await User.findByIdAndUpdate(req.user.id,
                { firstName, lastName, department},
                { new: true, runValidators: true}
            ).select('-password');

            res.join({
                success: true,
                message: 'Profile updated successfully',
                data: { user }
            });

        } catch (error) {
            console.error('update profile error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error while updating the profile'

            });
        }
    }
};

module.exports = authController;