// This is the applications entry points.
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')
require('dotenv').config();

const authRoutes = require('./routes/auth');
const machineRoutes = require('./routes/machines');
const reportRoutes = require('./routes/reports');
const userRoutes = require('./routes/users');


// To Initialize Express
const app = express();
const PORT = process.env.PORT || 8080

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

app.use(express.json({ limit: '10mb'}));
app.use(express.urlencoded({ extended: true}));


// Staring the application server 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });