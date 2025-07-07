const express = require('express');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const User = require('../models/User');

const router = express.Router();

//To Get all users  == Protected route

router.get('/', [
    auth,
    roleCheck(['admin'])
  ], async (req, res) => {
    try {
      const users = await User.find({ isActive: true })
        .select('-password')
        .sort({ createdAt: -1 });
  
      res.json({
        success: true,
        data: { users }
      });
    } catch (error) {
      console.error('Get users error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error fetching users'
      });
    }
  });

  // To get Get single user

  router.get('/:id', [
    auth,
    roleCheck(['admin']),
    param('id').isMongoId().withMessage('Invalid user ID')
  ], async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
  
      if (!user || !user.isActive) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.json({
        success: true,
        data: { user }
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error fetching user'
      });
    }
  });

  // This is to update the user role .

  router.put('/:id/role', [
    auth,
    roleCheck(['admin']),
    param('id').isMongoId().withMessage('Invalid user ID'),
    body('role')
      .isIn(['admin', 'technician', 'operator'])
      .withMessage('Invalid role')
  ], async (req, res) => {
    try {
      const { role } = req.body;
  
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true, runValidators: true }
      ).select('-password');
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.json({
        success: true,
        message: 'User role updated successfully',
        data: { user }
      });
    } catch (error) {
      console.error('Update user role error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error updating user role'
      });
    }
  });

  
  // Deactivate user == Protected route

  router.delete('/:id', [
    auth,
    roleCheck(['admin']),
    param('id').isMongoId().withMessage('Invalid user ID')
  ], async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isActive: false },
        { new: true }
      );
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
  
      res.json({
        success: true,
        message: 'User deactivated successfully'
      });
    } catch (error) {
      console.error('Deactivate user error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error deactivating user'
      });
    }
  });
  
  module.exports = router;



