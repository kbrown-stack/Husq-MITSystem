const MaintenanceLog = require('../models/MaintenanceLog');
const Machine = require('../models/Machine');

const maintenaceController = {
    createMaintenaceLog: async (req,res) => {
        try {
            const {
                machine,
                type,
                priority,
                description,
                software,
                scheduleDate,
                estimatedDuration,

            } = req.body;

            const foundMachine = await Machine.findOne({ _id: machine, isActive: true});
            if (!foundMachine) {
                return res.status(404).json({
                    success: false,
                    message: 'Machine not active or on the network.'
                });
            }

            const logData = {
                machine,
                type,
                priority,
                description,
                software,
                scheduleDate,
                estimatedDuration,
                createdBy: req.user._id

            };

            const newLog = new MaintenanceLog(logData);
            await newLog.save();

            res.status(201).json({
                success: true,
                message: 'Maintenace Log Created successfully', 
                data: {log: newLog}

            });

        } catch (error) {
            console.error('Create maintenace log error:', error);
            res.status(500).json({
                success: false,
                message: 'Server error occured while creating the maintenance log'
            });
        }
    }
};

module.exports = maintenaceController;