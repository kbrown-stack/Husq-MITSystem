const express = require('express');
const { body, param } = require('express-validator');
// const auth = require('../middleware/auth');
const { verifyToken, checkRoles } = require('../middleware/auth');
// const roleCheck = require('../middleware/roleCheck');
const userController = require('../controllers/userController');
// const User = require('../models/User');

const router = express.Router();

router.get('/', [
  verifyToken,
  checkRoles('admin')
], userController.getAllUsers);

router.get('/:id', [
  verifyToken,
  checkRoles('admin'),
  param('id').isMongoId().withMessage('Invalid user ID')
], userController.getUserById);

router.put('/:id/role', [
  verifyToken,
  checkRoles('admin'),
  param('id').isMongoId().withMessage('Invalid user ID'),
  body('role')
    .isIn(['admin', 'technician', 'operator'])
    .withMessage('Invalid role')
], userController.updateUserRole);

router.delete('/:id', [
  verifyToken,
  checkRoles('admin'),
  param('id').isMongoId().withMessage('Invalid user ID')
], userController.deactivateUser);

module.exports = router;


