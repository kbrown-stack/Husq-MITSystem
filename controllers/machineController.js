const { validationResult } = require('express-validator');
// const machine = require('../models/Machine');
// const maintenanceLog = require('../models/MaintenanceLog');
const QRCode =require('qrcode');
const Machine = require('../models/Machine');
const MaintenanceLog = require('../models/MaintenanceLog');


// Create Machine

const createMachine = async (req,res) => {
  try {
    const machine = new Machine(req.body);
    await machine.save();
    res.status(201).json({
      success: true,
      data: machine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating machine'
    });
  }
};

// Get ALL Machines
const getMachines = async (req,res) => {
  try {
    const machines = await Machine.find();
    res.json({
      success: true,
      data: machines
    });

  } catch (error) {
    console.error('Error getting machines:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching machines'
    })
  }
};

// Get Machines BY ID

const getMachine = async (req,res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(400).json({
        success: false,
        message: 'Machine not found'
      });
    }
    res.json({
      success: true,
      data: machine
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error while fetching the machine'
    });
  }
};

// UPDATE MACHINE

const updateMachine = async (req, res) => {
  try {
    const machine = await Machine.findByIdAndUpdate(req.params.id, req.body, {new: true});
    if (!machine) {
      return res.status(400).json({
        success: false,
        message: 'Machine not found'
      });
    }
    res.json({
      success: true,
      data: machine
    });
  } catch (error) {
    res.status(500).json({
      success: true,
      message: 'Error updating machine'
    });
  }
};

// DELETE MACHINE

const deleteMachine = async (req,res) => {
  try {

    const machine = await Machine.findByIdAndDelete(req.params.id);
    if (!machine) {
      return res.status(400).json({
        success: false,
        message: 'Machine not found'
      });

    }
    res.json({
      success: true,
      message: 'Machine deleted successfully.'
    });

  } catch (error) {
    res.status(500).json({
      success:false,
      message: 'Server error deleting machine'
    });
  }
};

//ASSIGN MACHINE TO USER

const assignMachine = async (req,res) => {
try {
  const { userId } = req.body;
  const machine = await Machine.findById(req.params.id);
  if (!machine) {
    return res.status(404).json({
      success:false,
      message: 'Machine not found'
    });
  }
  machine.assignedTo = userId;
  await machine.save();
  res.json({
    success: true,
    message: 'Machine assigned successfully'
  });
} catch (error) {
  res.status(500).json({
    success:false,
    message: 'Server error assigning machine'
  });
}
};

// UNASSIGN MACHINE TO USER

const unassignMachine = async (req,res) => {
  try {
    const machine = await Machine.findById(req.params.id);
    if (!machine) {
      return res.status(404).json({
        success:false,
        message: 'Machine not found'
      });
    }
    machine.assignedTo = null;
    await machine.save();
    res.json({
      success:true,
      message: 'Machine unassigned Successfully'
    });
  } catch (error) {
res.status(500).json({
  success:false,
  message: 'Server error unassigning machine'
});

  }
};

 // GET MACHINE STAT.

 const getStatistics = async (req,res) => {
  try {
    const count  = await Machine.countDocuments();
    res.json({
      success: true,
      data: {totalMachines: count}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics'
    });
  }
 };

module.exports = {
  createMachine,
  getMachines,
  getMachine,
  updateMachine,
  deleteMachine,
  assignMachine,
  unassignMachine,
  getStatistics
}





// const machineController = {

//     // CREATE MACHINE



    
//     createMachine: async (req,res) => {  // This helps to create the machine.
//         try {
//             const errors = validationResult(req);
//             if (!errors.isEmpty()) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Validation errors',
//                     errors: errors.array()
//                 });
//             }

//             const machineData = {
//                 ...req.body,
//                 createdBy: req.user._id
//             };

//             if (req.body.generateQR) {  // This helps generate QR code if requested.
//                 const qrData = {
//                     machineId: machineData.machineId,
//                     serialNumber: machineData.serialNumber,
//                     name: machineData.name
//                 };
//                 machineData.qrCode = await QRCode.toDataURL(JSON.stringify(qrData))
//             }

//             const newMachine = new Machine(machineData);
//             await newMachine.save();

//             await newMachine.populate([
//                 { path: 'createdBy', select: 'firstName lastName username'}
//             ]);

//             res.status(201).json({
//                 success: true,
//                 message: 'Machine created successfully.',
//                 data: { machine: newMachine }
//             });

//         } catch (error) {
//             console.error('Create machine error:', error);

//             if (error.code === 12000) {
//                 const field = Object.keys(error.keyPattern)[0];
//                 return res.status(400).json({
//                     success:false,
//                     message: `Machine with this ${field} already exists`
//                 });
//             }
//             res.status(500).json({
//                 success: false,
//                 message: 'Server error creating machine'
//             });
//         }
//     },

//     // GET ALL MACHINES

//     getMachines: async (req,res) => { // This will help get all machines by filtering it and also have pagination for it.
//         try {
//             const page = parseInt(req.query.page) || 1;
//             const limit = parseInt(req.query.limit) || 10;
//             const skip = (page - 1) * limit;

//             const filter = { isActive: true };  // This helps user to filter the machine or device by the manufacturer. 

//             if (req.query.status) {
//                 filter.status = req.query.status;
//             }

//             if (req.query.type) {
//                 filter.type = req.query.type;
//             }

//             if (req.query.manufacturer) {  
//                 filter.manufacturer =  new RegExp(req.query.manufacturer, 'i'); // This is to show its not case insensitive. 
//             }

//             if (req.query.assignedUser) {
//                 filter.assignedUser = req.query.assignedUser;
//             }

//             if (req.query.search) {
//                 const searchRegex = new RegExp(req.query.search, 'i');
//                 filter.$or = [
//                     { name: searchRegex },
//                     { machineId: searchRegex},
//                     { machineNumber: searchRegex},
//                     { model: searchRegex }
//                 ];
//             }

//             const sort = {};  // This helps to sort object.
//             if (req.query.sortBy) {
//                 // const sortField = req.query.sortBy;
//                 const sortOrder = req.query.sortOrder === 'disc' ? -1 : 1;
//                 sort[req.query.sortBy] = sortOrder;
//             } else {
//                 sort.createdAt = -1;
//             }

//             const machines = await Machine.find(filter)
//             .populate('createdBy', 'firstName lastName username')
//             .populate('assignedUser', 'firstName lastName username')
//             .populate('updatedBy', 'firstName lastName username')
//             .sort(sort)
//             .skip(skip)
//             .limit(limit);

//             const total = await Machine.countDocuments(filter);

//             res.json({
//                 success: true,
//                 data: {
//                     machines,
//                     pagination: {
//                         current: page,
//                         pages: Math.ceil(total/limit),
//                         total,
//                         limit
//                     }
//                 }
//             });
//         } catch (errror) {
//             console.error('Get machines error:', error);
//             res.status(500).json({
//                 success:false,
//                 message: 'Server error while fetching machines'
//             });
//         }
//     },

//     //GET MACHINES BY ID

// getMachine: async (req,res) => {  // This helps to get a single machine or device by ID.
//     try {
//         const machine = await Machine.findById(req.params.id)
//         .populate('createdBy', 'firstName lastName username')
//         .populate('assignedUser', 'firstName lastName username')
//         .populate('updatedBy', 'firstName lastName username');

//         if (!machine || !machine.isActive) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Machine not found'
//             })
//         }
//         const maintenaceHistory = await MaintenanceLog.find({  // This helps to get the maintenace history of the machine.
//             machine: machine._id,
//             isActive: true
//         })
//         .populate('technician', 'firstName lastName username')
//         .populate('supervisor', 'firstName lastName username')
//         .sort({ createdAt: -1 })
//         .limit(10);

//         res.json({
//             success: true,
//             data: {
//                 machine,
//                 maintenaceHistory
//             }
//         });
    
//     } catch (error) {
//         console.error('Get machine error:', 'error');
//         res.status(500).json({
//             success: false,
//             message: 'Server error while fetching the machine'
//         });
//     }
// },

//     // UPDATE MACHINE

//     updateMachine: async (req, res) => {
//         try {
//           const errors = validationResult(req);
//           if (!errors.isEmpty()) {
//             return res.status(400).json({
//               success: false,
//               message: 'Validation errors',
//               errors: errors.array()
//             });
//           }
    
//           const updateData = {
//             ...req.body,
//             updatedBy: req.user._id
//           };
    
//           const machine = await Machine.findByIdAndUpdate(
//             req.params.id,
//             updateData,
//             { new: true, runValidators: true }
//           )
//             .populate('createdBy', 'firstName lastName username')
//             .populate('assignedUser', 'firstName lastName username')
//             .populate('updatedBy', 'firstName lastName username');
    
//           if (!machine) {
//             return res.status(404).json({
//               success: false,
//               message: 'Machine not found'
//             });
//           }
    
//           res.json({
//             success: true,
//             message: 'Machine updated successfully',
//             data: { machine }
//           });
//         } catch (error) {
//           console.error('Update machine error:', error);
//           res.status(500).json({
//             success: false,
//             message: 'Server error updating machine'
//           });
//         }
//       },

//       // DELETE MACHINE

//       deleteMachine: async (req, res) => {
//         try {
//           const machine = await Machine.findByIdAndUpdate(
//             req.params.id,
//             { 
//               isActive: false,
//               updatedBy: req.user._id
//             },
//             { new: true }
//           );
    
//           if (!machine) {
//             return res.status(404).json({
//               success: false,
//               message: 'Machine not found'
//             });
//           }
    
//           res.json({
//             success: true,
//             message: 'Machine deleted successfully'
//           });
//         } catch (error) {
//           console.error('Delete machine error:', error);
//           res.status(500).json({
//             success: false,
//             message: 'Server error deleting machine'
//           });
//         }
//       },
    

//     //ASSIGN MACHINE TO USER

//     assignMachine: async (req, res) => {
//         try {
//           const { userId } = req.body;
          
//           const machine = await Machine.findByIdAndUpdate(
//             req.params.id,
//             {
//               assignedUser: userId,
//               assignedDate: new Date(),
//               status: 'in_use',
//               updatedBy: req.user._id
//             },
//             { new: true }
//           )
//             .populate('assignedUser', 'firstName lastName username');
    
//           if (!machine) {
//             return res.status(404).json({
//               success: false,
//               message: 'Machine not found'
//             });
//           }
    
//           res.json({
//             success: true,
//             message: 'Machine assigned successfully',
//             data: { machine }
//           });
//         } catch (error) {
//           console.error('Assign machine error:', error);
//           res.status(500).json({
//             success: false,
//             message: 'Server error assigning machine'
//           });
//         }
//       },

//       //UNASSIGN MACHINE TO USER

//       unassignMachine: async (req, res) => {
//         try {
//           const machine = await Machine.findByIdAndUpdate(
//             req.params.id,
//             {
//               assignedUser: null,
//               assignedDate: null,
//               status: 'ready',
//               updatedBy: req.user._id
//             },
//             { new: true }
//           );
    
//           if (!machine) {
//             return res.status(404).json({
//               success: false,
//               message: 'Machine not found'
//             });
//           }
    
//           res.json({
//             success: true,
//             message: 'Machine unassigned successfully',
//             data: { machine }
//           });
//         } catch (error) {
//           console.error('Unassign machine error:', error);
//           res.status(500).json({
//             success: false,
//             message: 'Server error unassigning machine'
//           });
//         }
//       },

//       // GET MACHINE STAT.

//       getStatistics: async (req, res) => {
//         try {
//           const stats = await Machine.aggregate([
//             { $match: { isActive: true } },
//             {
//               $group: {
//                 _id: '$status',
//                 count: { $sum: 1 }
//               }
//             }
//           ]);
    
//           const typeStats = await Machine.aggregate([
//             { $match: { isActive: true } },
//             {
//               $group: {
//                 _id: '$type',
//                 count: { $sum: 1 }
//               }
//             }
//           ]);
    
//           const totalMachines = await Machine.countDocuments({ isActive: true });
//           const assignedMachines = await Machine.countDocuments({ 
//             isActive: true, 
//             assignedUser: { $ne: null } 
//           });
    
//           res.json({
//             success: true,
//             data: {
//               statusDistribution: stats,
//               typeDistribution: typeStats,
//               totalMachines,
//               assignedMachines,
//               availableMachines: totalMachines - assignedMachines
//             }
//           });
//         } catch (error) {
//           console.error('Get statistics error:', error);
//           res.status(500).json({
//             success: false,
//             message: 'Server error fetching statistics'
//           });
//         }
//       }
//     };

    


// module.exports = machineController;

