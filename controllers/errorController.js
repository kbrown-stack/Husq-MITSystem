// This file handles all the error functions in the application.

const { error } = require("winston");
const { stack } = require("../routes/auth");
const AppError = require("./../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid  ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
    console.log("Duplicate handler triggered");

  const match = err.message.match(/(["'])(\\?.)*?\1/); // This is a regular expression
  const value = match ? match[0] : "duplicate value";
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    // This is to show when erros made are operational in production , so send the error to the client.

    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      // while this is a programming error or any other error that client is not meant to see.
      status: "error",
      message: "Something went  wrong", // this is generic message
    });
  }
};

// Using Global Error handling middleware

module.exports = (err, req, res, next) => {

    console.log("Global error triggered!");
    console.log("Error name:", err.name);
    console.log("Error code:", err.code);
    console.log("Error message:", err.message);



  // console.log(err.stack);

  err.statusCode = err.statusCode || 500; // This is the default error status code from Mongooose db.
  err.status = err.status || "error";

  // To show the errors when in development  and when in production

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
    console.log("Global error triggered!");
    console.log("Error name:", err.name);
    console.log("Error code:", err.code);
    console.log("Error message:", err.message);

  } else if (process.env.NODE_ENV === "production") {
    let error = err;

    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code  && error.code === 11000) error = handleDuplicateFieldsDB(error);

    sendErrorProd(error, res);
  }
};
