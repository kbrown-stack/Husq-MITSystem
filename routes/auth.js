const express = require('express');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();