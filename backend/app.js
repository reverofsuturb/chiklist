const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { environment } = require("./config");
const isProduction = environment === "production";

const app = express();

// Beginning of Middleware:

// Middleware for logging information about requests and responses.
app.use(morgan("dev"));

//  Middleware for parsing cookies.
app.use(cookieParser());

//  Middleware for parsing JSON bodies of requests with Content-Type of "application/json".
app.use(express.json());

// Begin Security Middleware

if (!isProduction) {
  // Enable cors only in development.
  app.use(cors());
}

// Helmet helps set a variety of headers to better secure app.
app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

// Set the _csrf token and create req.csrfToken method.
app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

// End Security Middleware

// Begin Routes/Errorhandlers Middleware

const routes = require("./routes");
// Connect all the routes.
app.use(routes);

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

const { ValidationError } = require('sequelize');

// Process sequelize errors.
app.use((err, _req, _res, next) => {
  // Check if error is a Sequelize error:
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = 'Validation error';
    err.errors = errors;
  }
  next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    title: err.title || 'Server Error',
    message: err.message,
    errors: err.errors,
    stack: isProduction ? delete res.json.stack : err.stack
  });
});

// End Routes/Errorhandlers Middleware

//End of Middleware

module.exports = app;
