// This is the applications entry points.
const express = require('express');
const mongoose = require('mongoose');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')
require('dotenv').config();

const authRoutes = require('./routes/auth');
const machineRoutes = require('./routes/machines');
const reportRoutes = require('./routes/reports');
const userRoutes = require('./routes/users');
const maintenanceRoutes = require('./routes/maintenance');



// To Initialize Express
const app = express();
const PORT = process.env.PORT || 8080

// Connect to MongoDB
require('./config/database');

// To secure the middleware on the Express.
app.use(helmet());
app.use(cors());

// Rate Limiting , this helps reduce repeated request to the public API.
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // this shows 10mins.
    max: 100 // this means 100 IP for each request.
});

app.use(limiter);

//Using the Middleware as a bodyperser. 
// app.use(express.json())

app.use(express.json({limit: '15kb'})); 

app.use((err,req,res,next) => {
    if (err instanceof SyntaxError && err.status === 400 & 'body' in err) {
        return next(new AppError('Invalid Json format in body.', 400));
    }
    next()
});



// app.use(express.json({ limit: '10mb'}));
app.use(express.urlencoded({ extended: true}));

//This is the Mounted Routes connected to all routes as listed below.

app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/users', userRoutes)
app.use('/api/maintenance', maintenanceRoutes);


// To check Health check point 

app.get('/api/health', (req,res) => {
    res.json({status: 'OK', Timestamp: new Date().toISOString()})
});



// Using to use.all function to handle all URL request and display error when they fail. Not that this request is meant to be below every route.
// Note that this is also a get request.

app.all('*', (req,res,next) => {
    // res.status(404).json({
    //     status: 'fail',
    //     messsage: `Can't find ${req.url} on this application!`
    // });

    // const err = new Error(`Can't find ${req.originalUrl} on the application`); // this is creating a built in error and status code.
    // err.status = 'fail';
    // err.statusCode = 404;

    // next(err);
    next(new AppError(`Can't find ${req.originalUrl} on the application`, 404));
})



// To check for error handling midlleware using th global error handler.

app.use((err,req,res,next) => {
    console.error(err.stack);

    // Setting a default status code message to make the global middlware dynamic
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    const message = err.message || 'Something went wrong';

    res.status(statusCode).json({
        success: false,
        status,
        message,

    });


    // res.status(500).json({
    //     success: false,
    //     messsage: 'Something went wrong',
    //     error: process.env.NODE_ENV === 'development' ? err.messsage : undefined

    // });

});

// Using Error handling middleware 
app.use(globalErrorHandler);

// Staring the application server 


// console.log("Enviroment:", process.env.NODE_ENV);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });


  