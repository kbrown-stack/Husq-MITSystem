const express = require('express');
const mongoose = require('mongoose');
const { body, param, validationResult } = require('express-validator');

// VALIDATING THE RULES FOR CREATING A MAINTENANCE LOG

const validateMaintenanceLog = [  // This is an array of middleware functions

    body('machine').notEmpty().withMessage('Machine ID is required'),
    body('type').notEmpty().withMessage('Maintenance type is required'),
    body('priority').isIn(['low', 'medium', 'high']).withMessage('Priority must be low , medium or high'),
    body('description').notEmpty().withMessage('Description is required'),
    body('scheduleDate').isISO8601().withMessage('Schedule date must be valid date'),
    body('estimatedDuration').optional().isNumeric().withMessage('Estimated duration must be a number'),
    body('software').optional().isString(),

    // This below is the Middleware to handle the validation result. 

    (req,res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array(),
            });
        }
        next();
    },

];


// VALIDATING FOR UPDATING A MAINTENANCE LOG

const validateUpdateMaintenanceLog = [

    body('type').optional().notEmpty().withMessage('Maintenance type cannot be empty'),
    body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Priority must be low , medium or high'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('scheduleDate').optional().isISO8601().withMessage('Schedule date must be valid date'),
    body('estimatedDuration').optional().isNumeric().withMessage('Estimated duration must be a number'),
    body('software').optional().isString(),


    (req,res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array(),
            });
        }
        next();
    },



];

// VALIDATING THE DATABASE- MONGDB OBJECT

const validateObjectParam = [
    param('id')
    .isMongoId()
    .withMessage('Invalid ID format: must be a valid MongoDB object'),


    (req,res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                success: false,
                errors: errors.array(),
            });
        }
        next();
    },


];

module.exports = {
    validateMaintenanceLog,
    validateUpdateMaintenanceLog,
    validateObjectParam,
};