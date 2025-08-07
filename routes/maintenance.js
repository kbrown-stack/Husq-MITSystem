const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenanceController');
const { verifyToken, checkRoles } = require('../middleware/auth');


// The API for the maintnace routes is below here;

// CREATE MAINTENANCE LOG ROUTE

router.post(
    '/', 
    verifyToken,
    checkRoles('admin', 'technician'), // The roles here can always be changed or adjusted as needed.
   maintenanceController.createMaintenanceLog
);

// GET ALL MAINTENANCE LOG 

router.get('/', 
    verifyToken,
    checkRoles('admin', 'technician', 'supervisor'),
    maintenanceController.getAllMaintenanceLogs
);

// GET MAINTENANCE LOG BY ID

router.get('/:id',
    verifyToken,
    checkRoles('admin', 'technician'),
    maintenanceController.getMaintenanceLogById
);

// UPDATE MAINTENANCE LOG

router.put('/:id',
    verifyToken,
    checkRoles('admin', 'technician'),
    maintenanceController.updateMaintenanceLog
);

// DELETE MAINTENANCE LOG

router.delete('/:id',
    verifyToken,
    checkRoles('admin'),
    maintenanceController.deleteMaintenanceLog
);

module.exports = router;



