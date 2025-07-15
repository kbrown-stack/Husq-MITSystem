const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const machineController = require('../controllers/machineController');


// This is to GET all Machines. 

router.get('/', auth, machineController.getMachines);

// This is to GET  machine statistics

router.get('/stats', auth, machineController.getStatistics);

// This is to GET single machine (WHICH BE DONE BY ID)

router.get('/:id', [
  auth,
  param('id').isMongoId().withMessage('Invalid machine ID')
], machineController.getMachine);


// This Create machine (admin/technician only) // Protected route.

router.post('/', [
  auth,
  roleCheck(['admin', 'technician']),
  body('machineId')
    .notEmpty()
    .trim()
    .withMessage('Machine ID is required'),
  body('name')
    .notEmpty()
    .trim()
    .withMessage('Machine name is required'),
  body('type')
    .isIn([ 'Desktop', 'Laptop', 'Tablet', 'Mini pc', 'Other '])
    .withMessage('Mini pc'),

  body('manufacturer')
    .notEmpty()
    .trim()
    .withMessage('Manufacturer is required'),

  body('machineId')
    .notEmpty()
    .trim()
    .withMessage('machineId is required'),

  body('profile')
    .notEmpty()
    .trim()
    .withMessage('Profile is required'),

  body('builtDate')
    .isISO8601()
    .withMessage('Built date must be a valid date'),


], machineController.createMachine);



// This is to Update machine (admin/technician only) == Protected route


router.put('/:id', [
  auth,
  roleCheck(['admin', 'technician']),
  param('id').isMongoId().withMessage('Invalid machine ID')
], machineController.updateMachine);


// Delete machine (admin only) // Protected route.

router.delete('/:id', [
  auth,
  roleCheck(['admin']),
  param('id').isMongoId().withMessage('Invalid machine ID')
], machineController.deleteMachine);


// Assign machine (admin/technician only) // Protected route.

router.post('/:id/assign', [
  auth,
  roleCheck(['admin', 'technician']),
  param('id').isMongoId().withMessage('Invalid machine ID'),
  body('userId').isMongoId().withMessage('Invalid user ID')
], machineController.assignMachine);


// This is for machines that are not assigned. (admin/technician only)

router.post('/:id/unassign', [
  auth,
  roleCheck(['admin', 'technician']),
  param('id').isMongoId().withMessage('Invalid machine ID')
], machineController.unassignMachine);


module.exports = router;

