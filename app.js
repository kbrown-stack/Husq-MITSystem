const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit')



// To Initialize Express
const app = express();
const PORT = process.env.PORT || 8080


// Staring the application server 

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });