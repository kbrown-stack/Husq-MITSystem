const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router()

// To register or Create a POST end point

router.post('/register', [
    body('username')
    .isLength({ min: 3, max: 30})
    .withMessage('Username must be between 5 and 20 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters , numbers and underscores'),
    body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please kindly provide a valid email'),
    body('password')
    .isLength({ min: 6})
    .withMessage('Password must be at least 5 characters long'),
    body('firstName')
    .notEmpty()
    .trim()
    .withMessage('First name is required'),
    body('lastName')
    .notEmpty()
    .trim()
    .withMessage('lastName is required'),
    body('role')
    .optional()
    .isIn(['admin', 'technician', 'operator'])
    .withMessage('Invalid role')

], authController.register);

// To login

router.post('/login', [
    body('username')
    .notEmpty()
    .withMessage('Username or email is required'),
    body('password')
    .notEmpty()
    .withMessage('Password is required')
    
], authController.login);

// Get the protected route Profile

router.get('/profile', auth, authController.updateProfile);

// Update the protected profile

router.put('/profile', auth, authController.updateProfile)



module.exports = router;