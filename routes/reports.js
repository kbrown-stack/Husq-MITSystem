const express = require('express');
const { query } = require('express-validator');
// const auth = require('../middleware/auth');
const { verifyToken, checkRoles } = require('../middleware/auth')
// const roleCheck = require('../middleware/roleCheck');
const reportController = require('../controllers/reportController');

const router = express.Router();

// To Generate the inventory report

router.get('/inventory', [
  verifyToken,
  checkRoles('admin', 'technician'),
    query('format')
      .optional()
      .isIn(['json', 'csv', 'excel'])
      .withMessage('Format must be json, csv, or excel')
  ], reportController.generateInventoryReport);
  
  // To Generate Maintenance Report

  router.get('/maintenance', [
    verifyToken,
    checkRoles('admin', 'technician'),
    query('format')
      .optional()
      .isIn(['json', 'csv', 'excel'])
      .withMessage('Format must be json, csv, or excel'),
    query('startDate')
      .optional()
      .isISO8601()
      .withMessage('Start date must be valid'),
    query('endDate')
      .optional()
      .isISO8601()
      .withMessage('End date must be valid')
  ], reportController.generateMaintenanceReport);


  // To Generate Utilization report 

  router.get('/utilization', [
    verifyToken,
    checkRoles('admin', 'technician')
  ], reportController.generateUtilizationReport);



  module.exports = router;