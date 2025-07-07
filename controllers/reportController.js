const Machine = require('../models/Machine');
const MaintenanceLog = require('../models/MaintenanceLog');
const User = require('../models/User');
const XLSX = require('xlsx'); // this helps you to read files in excel , pdf 
const createCsvWriter = require('csv-writer'); // this helps convert objects written into a file. 
const path = require('path');
const fs = require('fs');


const reportController = {

    //  TO GENERATE MACHINE INVENTORY REPORT

    generateInventoryReport: async (req, res) => {
      try {
        const { format = 'json', status, type, assignedUser } = req.query;
  
        // Build filter
        const filter = { isActive: true };
        if (status) filter.status = status;
        if (type) filter.type = type;
        if (assignedUser) filter.assignedUser = assignedUser;
  
        const machines = await Machine.find(filter)
          .populate('assignedUser', 'firstName lastName username')
          .populate('createdBy', 'firstName lastName username')
          .sort({ createdAt: -1 });
  
        const reportData = machines.map(machine => ({
          machineId: machine.machineId,
          name: machine.name,
          type: machine.type,
          manufacturer: machine.manufacturer,
          model: machine.model,
          serialNumber: machine.serialNumber,
          status: machine.status,
          assignedUser: machine.assignedUser ? 
            `${machine.assignedUser.firstName} ${machine.assignedUser.lastName}` : 'Unassigned',
          purchaseDate: machine.purchaseDate?.toISOString().split('T')[0],
          cost: machine.cost,
          location: machine.location ? 
            `${machine.location.building || ''} ${machine.location.floor || ''} ${machine.location.room || ''}`.trim() : '',
          createdAt: machine.createdAt.toISOString().split('T')[0]
        }));
  
        if (format === 'json') {
          return res.json({
            success: true,
            data: {
              report: reportData,
              summary: {
                totalMachines: reportData.length,
                generatedAt: new Date().toISOString()
              }
            }
          });
        }
  
        if (format === 'csv') {
          const filename = `inventory_report_${Date.now()}.csv`;
          const filepath = path.join(__dirname, '../temp', filename);
  
          // Ensure temp directory exists
          const tempDir = path.dirname(filepath);
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }
  
          const csvWriter = createCsvWriter({
            path: filepath,
            header: [
              { id: 'machineId', title: 'Machine ID' },
              { id: 'name', title: 'Name' },
              { id: 'type', title: 'Type' },
              { id: 'manufacturer', title: 'Manufacturer' },
              { id: 'model', title: 'Model' },
              { id: 'serialNumber', title: 'Serial Number' },
              { id: 'status', title: 'Status' },
              { id: 'assignedUser', title: 'Assigned User' },
              { id: 'purchaseDate', title: 'Purchase Date' },
              { id: 'cost', title: 'Cost' },
              { id: 'location', title: 'Location' },
              { id: 'createdAt', title: 'Created Date' }
            ]
          });
  
          await csvWriter.writeRecords(reportData);
  
          res.download(filepath, filename, (err) => {
            if (err) {
              console.error('Download error:', err);
            }
            // Clean up file after download
            fs.unlink(filepath, (unlinkErr) => {
              if (unlinkErr) console.error('File cleanup error:', unlinkErr);
            });
          });
        } else if (format === 'excel') {
          const worksheet = XLSX.utils.json_to_sheet(reportData);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Machine Inventory');
  
          const filename = `inventory_report_${Date.now()}.xlsx`;
          const filepath = path.join(__dirname, '../temp', filename);
  
          // Ensure temp directory exists
          const tempDir = path.dirname(filepath);
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }
  
          XLSX.writeFile(workbook, filepath);
  
          res.download(filepath, filename, (err) => {
            if (err) {
              console.error('Download error:', err);
            }
            // Clean up file after download
            fs.unlink(filepath, (unlinkErr) => {
              if (unlinkErr) console.error('File cleanup error:', unlinkErr);
            });
          });
        }
      } catch (error) {
        console.error('Generate inventory report error:', error);
        res.status(500).json({
          success: false,
          message: 'Server error generating inventory report'
        });
      }
    },

    // TO GENERATE MAINTENANCE REPORT 

    generateMaintenanceReport: async (req, res) => {
        try {
          const { format = 'json', startDate, endDate, status, type } = req.query;
    
          // Build filter
          const filter = { isActive: true };
          
          if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
          }
          
          if (status) filter.status = status;
          if (type) filter.type = type;
    
          const maintenanceLogs = await MaintenanceLog.find(filter)
            .populate('machine', 'machineId name type manufacturer model')
            .populate('technician', 'firstName lastName username')
            .populate('supervisor', 'firstName lastName username')
            .sort({ createdAt: -1 });
    
          const reportData = maintenanceLogs.map(log => ({
            machineId: log.machine?.machineId || 'N/A',
            machineName: log.machine?.name || 'N/A',
            title: log.title,
            type: log.type,
            priority: log.priority,
            status: log.status,
            technician: log.technician ? 
              `${log.technician.firstName} ${log.technician.lastName}` : 'N/A',
            supervisor: log.supervisor ? 
              `${log.supervisor.firstName} ${log.supervisor.lastName}` : 'N/A',
            scheduledDate: log.scheduledDate?.toISOString().split('T')[0],
            completionDate: log.completionDate?.toISOString().split('T')[0],
            estimatedDuration: log.estimatedDuration,
            actualDuration: log.actualDuration,
            totalCost: log.totalCost,
            createdAt: log.createdAt.toISOString().split('T')[0]
          }));
    
          if (format === 'json') {
            return res.json({
              success: true,
              data: {
                report: reportData,
                summary: {
                  totalRecords: reportData.length,
                  totalCost: reportData.reduce((sum, item) => sum + (item.totalCost || 0), 0),
                  generatedAt: new Date().toISOString()
                }
              }
            });
          }
    
          if (format === 'csv') {
            const filename = `maintenance_report_${Date.now()}.csv`;
            const filepath = path.join(__dirname, '../temp', filename);
    
            const tempDir = path.dirname(filepath);
            if (!fs.existsSync(tempDir)) {
              fs.mkdirSync(tempDir, { recursive: true });
            }
    
            const csvWriter = createCsvWriter({
              path: filepath,
              header: [
                { id: 'machineId', title: 'Machine ID' },
                { id: 'machineName', title: 'Machine Name' },
                { id: 'title', title: 'Title' },
                { id: 'type', title: 'Type' },
                { id: 'priority', title: 'Priority' },
                { id: 'status', title: 'Status' },
                { id: 'technician', title: 'Technician' },
                { id: 'supervisor', title: 'Supervisor' },
                { id: 'scheduledDate', title: 'Scheduled Date' },
                { id: 'completionDate', title: 'Completion Date' },
                { id: 'estimatedDuration', title: 'Estimated Duration (hrs)' },
                { id: 'actualDuration', title: 'Actual Duration (hrs)' },
                { id: 'totalCost', title: 'Total Cost' },
                { id: 'createdAt', title: 'Created Date' }
              ]
            });
    
            await csvWriter.writeRecords(reportData);
    
            res.download(filepath, filename, (err) => {
              if (err) console.error('Download error:', err);
              fs.unlink(filepath, (unlinkErr) => {
                if (unlinkErr) console.error('File cleanup error:', unlinkErr);
              });
            });
          }
        } catch (error) {
          console.error('Generate maintenance report error:', error);
          res.status(500).json({
            success: false,
            message: 'Server error generating maintenance report'
          });
        }
      },
      

      // TO GENERATE THE UTILIZATION REPORT

      generateUtilizationReport: async (req, res) => {
        try {
          const utilizationData = await Machine.aggregate([
            { $match: { isActive: true } },
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 },
                machines: { 
                  $push: {
                    machineId: '$machineId',
                    name: '$name',
                    type: '$type'
                  }
                }
              }
            }
          ]);
    
          const typeUtilization = await Machine.aggregate([
            { $match: { isActive: true } },
            {
              $group: {
                _id: '$type',
                total: { $sum: 1 },
                inUse: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'in_use'] }, 1, 0]
                  }
                },
                ready: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'ready'] }, 1, 0]
                  }
                },
                maintenance: {
                  $sum: {
                    $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0]
                  }
                }
              }
            },
            {
              $addFields: {
                utilizationRate: {
                  $multiply: [
                    { $divide: ['$inUse', '$total'] },
                    100
                  ]
                }
              }
            }
          ]);
    
          res.json({
            success: true,
            data: {
              statusBreakdown: utilizationData,
              typeUtilization: typeUtilization,
              generatedAt: new Date().toISOString()
            }
          });
        } catch (error) {
          console.error('Generate utilization report error:', error);
          res.status(500).json({
            success: false,
            message: 'Server error generating utilization report'
          });
        }
      }
    };
    
    module.exports = reportController;