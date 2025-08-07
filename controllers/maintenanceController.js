const MaintenanceLog = require('../models/MaintenanceLog');
const Machine = require('../models/Machine');

const maintenanceController = {

    // CREATE MAINTENACE LOGS
    createMaintenanceLog: async (req,res) => { // This creates a maitenance log
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
    },

    // GET ALL MAINTENANCE LOGS

    getAllMaintenanceLogs: async (req,res) => {
        try {
            const logs = await MaintenanceLog.find().populate('machine createdBy');
            res.status(200).json({
                success: true,
                data: logs,
            });
        } catch (error) {
            console.error('Get all logs error:', error);
            res.status(500).json({
                success:false,
                message: 'Server error fetching the maintenace logs'
            });
        }
    },

  // GET ALL MAINTENANCE LOGS BY ID

  getMaintenanceLogById: async (req,res) => {
    try {
        const log = await MaintenanceLog.findById(req.params.id).populate('machine createdBy');
        if (!log) {
            return res.status(400).json({
                success:false,
                message: 'Maintenace log not found',
            });
        }
            res.status(200).json({
        success: true,
        data: log,
    });
    } catch (error) {
        console.error('Get log by ID error:', error);
        res.status(500).json({
            success:false,
            message: 'Server error while fetching maintenance log'
        });
    }

  },

  // UPDATE MAINTENANCE LOG 

  updateMaintenanceLog: async (req, res) => {
    try {
        const updated = await MaintenanceLog.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });

        if (!updated) {
            return res.status(404).json({
                success:false,
                message: 'Maintenance log not found',
            });

        }
        res.status(200).json({
            success: true,
            message: 'Maintenance log updated successfully',
            data: updated,
        });
    } catch (error) {
        console.error('update log error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error updating maintenance log',
        });
    }
  },

// DELETE MAINTENANCE LOG 

deleteMaintenanceLog: async (req,res) => {
    try {
        const deleted = await MaintenanceLog.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(400).json({
                success: false,
                message: 'Maintenance log not found'
            });
        }
        res.status(200).json({
            success: true,
                message: 'Maintenance log deleted successfully'
        });
    } catch (error) {
        console.error('Delete log error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error while deleting maintenance log'
        });
    }

},

};

module.exports = maintenanceController;