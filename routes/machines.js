const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');
const machineController = require('../controllers/machineController');

// const router = express.Router();



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
    .isIn([ 'Lathe', 'Mill', 'Press', 'Welder', 'Grinder', 'Drill', 'Other'])
    .withMessage('Invalid machine type'),
  body('manufacturer')
    .notEmpty()
    .trim()
    .withMessage('Manufacturer is required'),
  body('model')
    .notEmpty()
    .trim()
    .withMessage('Model is required'),
  body('serialNumber')
    .notEmpty()
    .trim()
    .withMessage('Serial number is required'),
  body('purchaseDate')
    .isISO8601()
    .withMessage('Purchase date must be a valid date'),
  body('cost')
    .optional()
    .isNumeric()
    .withMessage('Cost must be a number')
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

