const { validationResult } = require('express-validator');
const user = require('../models/User');

const userController = {

    // GET all active users

    getAllUsers: async (req, res) => {
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
    },
  
    // GET single user by ID

    getUserById: async (req, res) => {
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
    },
  
   // UPDATE USER 

    updateUserRole: async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }
  
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
    },
  
   // DEACTIVATE USER
   
    deactivateUser: async (req, res) => {
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
    }
  };
  
  module.exports = userController;
  