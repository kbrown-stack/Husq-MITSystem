const { validationResult } = require('express-validator');
const machine = require('../models/Machine');
const maintenanceLog = require('../models/MaintenanceLog');
const QRCode =require('qrcode');

const machineController = {
    createMachine: async (req,res) => {  // This helps to create the machine.
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array()
                });
            }

            const machineData = {
                ...req.body,
                createdBy: req.user._id
            };

            if (req.body.generateQR) {  // This helps generate QR code if requested.
                const qrData = {
                    machineId: machineData.machineId,
                    serialNumber: machineData.serialNumber,
                    name: machineData.name
                };
                machineData.qrCode = await QRCode.toDataURL(JSON.stringify(qrData))
            }
            const machine = new machine(machineData);
            await machine.save();

            await machine.populate([
                { path: 'createdBy', select: 'firstName lastName username'}
            ]);

            res.status(201).json({
                success: true,
                message: 'Machine created successfully.',
                data: { machine }
            });

        } catch (error) {
            console.error('Create machine error:', error);

            if (error.code === 12000) {
                const field = Object.keys(error.keyPattern)[0];
                return res.status(400).json({
                    success:false,
                    message: 'Machine with this ${field} already exists'
                });
            }
            res.status(500).json({
                success: false,
                message: 'Server error creating machine'
            });
        }
    }
};

module.exports = machineController;

