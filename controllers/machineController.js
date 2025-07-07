const { validationResult } = require('express-validator');
// const machine = require('../models/Machine');
const maintenanceLog = require('../models/MaintenanceLog');
const QRCode =require('qrcode');
const Machine = require('../models/Machine');
const MaintenanceLog = require('../models/MaintenanceLog');

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
            const newMachine = new Machine(machineData);
            await newMachine.save();

            await newMachine.populate([
                { path: 'createdBy', select: 'firstName lastName username'}
            ]);

            res.status(201).json({
                success: true,
                message: 'Machine created successfully.',
                data: { machine: newMachine }
            });

        } catch (error) {
            console.error('Create machine error:', error);

            if (error.code === 12000) {
                const field = Object.keys(error.keyPattern)[0];
                return res.status(400).json({
                    success:false,
                    message: `Machine with this ${field} already exists`
                });
            }
            res.status(500).json({
                success: false,
                message: 'Server error creating machine'
            });
        }
    },

    getMachines: async (req,res) => { // This will help get all machines by filtering it and also have pagination for it.
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const skip = (page - 1) * limit;

            const filter = { isActive: true };  // This helps user to filter the machine or device by the manufacturer. 

            if (req.query.status) {
                filter.status = req.query.status;
            }

            if (req.query.type) {
                filter.type = req.query.type;
            }

            if (req.query.manufacturer) {  
                filter.manufacturer =  new RegExp(req.query.manufacturer, 'i'); // This is to show its not case insensitive. 
            }

            if (req.query.assignedUser) {
                filter.assignedUser = req.query.assignedUser;
            }

            if (req.query.search) {
                const searchRegex = new RegExp(req.query.search, 'i');
                filter.$or = [
                    { name: searchRegex },
                    { machineId: searchRegex},
                    { machineNumber: searchRegex},
                    { model: searchRegex }
                ];
            }

            const sort = {};  // This helps to sort object.
            if (req.query.sortBy) {
                const sortField = req.query.sortBy;
                const sortOrder = req.query.sortOrder === 'disc' ? -1 : 1;
                sort[sortField] = sortOrder;
            } else {
                sort.createdAt = -1;
            }

            const machines = await Machine.find(filter)
            .populate('createdBy', 'firstName lastName username')
            .populate('assignedUser', 'firstName lastName username')
            .populate('updatedBy', 'firstName lastName username')
            .sort(sort)
            .skip(skip)
            .limit(limit);

            const total = await Machine.countDocuments(filter);

            res.json({
                success: true,
                data: {
                    machines,
                    pagination: {
                        current: page,
                        pages: Math.ceil(total/limit),
                        total,
                        limit
                    }
                }
            });
        } catch (errror) {
            console.error('Get machines error:', error);
            res.status(500).json({
                success:false,
                message: 'Server error while fetching machines'
            });
        }
    },
getMachine: async (req,res) => {  // This helps to get a single machine or device by ID.
    try {
        const machine = await Machine.findById(req.params.id)
        .populate('createdBy', 'firstName lastName username')
        .populate('assignedUser', 'firstName lastName username')
        .populate('updatedBy', 'firstName lastName username');

        if (!machine || !machine.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Machine not found'
            })
        }
        const maintenaceHistory = await MaintenanceLog.find({  // This helps to get the maintenace history of the machine.
            machine: machine._id,
            isActive: true
        })
        .populate('technician', 'firstName lastName username')
        .populate('supervisor', 'firstName lastName username')
        .sort({ createdAt: -1 })
        .limit(10);

        res.json({
            success: true,
            data: {
                machine,
                maintenaceHistory
            }
        });
    
    } catch (error) {
        console.error('Get machine error:', 'error');
        res.status(500).json({
            success: false,
            message: 'Server error while fetching the machine'
        });
    }
}

};

module.exports = machineController;

