const express = require('express');
const router = express.Router();
const maintenaceController = require('../controllers/maintenanceController');
const { verifyToken, checkRoles } = require('../middleware/auth');


// The API for the maintnace routes is below here;

router.post(
    '/', 
    verifyToken,
    checkRoles('admin', technician), // The roles here can always be chnaged or adjusted as needed.
    maintenaceController.createMaintenaceLog
);

