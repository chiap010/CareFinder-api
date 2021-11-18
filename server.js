/**
 * server.js - Set up a server
 * @type {Parsers|*}
 */
/*
 * Provides a way of working with directories and file paths
 * https://www.npmjs.com/package/path
 */
const path = require("path");
/*
 * This is an express server
 * https://www.npmjs.com/package/express
 */
const express = require("express");
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(express.static(path.join(__dirname, "public")));
/*
 * Middleware for parsing the request body
 * https://www.npmjs.com/package/body-parser
 */
const bodyParser = require("body-parser");
server.use(bodyParser.json());
/*
 * Set various HTTP headers to help secure the server
 * https://www.npmjs.com/package/helmet
 */
const helmet = require("helmet");
server.use(helmet());
/*
 * Ruby-like logger for logging messages
 * https://www.npmjs.com/package/logger
 */
const logger = require("morgan");
server.use(logger("dev"));
/*
 * Database object modelling
 * https://www.npmjs.com/package/mongoose
 */
//const mongoose = require("mongoose");
// Connect to the Mongo database
//mongoose.Promise = global.Promise;
//mongoose.connect(process.env.MONGO_CONN, { useNewUrlParser: true });

// set port, listen for requests
const PORT = process.env.PORT || 5556;
server.listen(PORT, () => {
       console.log(`Server is running on port ${PORT}.`);
});

const mongoose = require("mongoose");
//const { application } = require("express");

// Get MongoDB connection string
require("dotenv").config();
var uri = process.env.MONGO_CONN;

// Connect to MongoDB
mongoose.connect(uri, {
       useUnifiedTopology: true,
       useNewUrlParser: true,
});

const connection = mongoose.connection;

connection.once("open", function () {
       console.log("MongoDB database connection established successfully.");
});

// Set up the routes
// -----------------

const urlVersioning = "v1";
const hospitalRoutes = require("./src/routes/hospital-routes");
server.use("/api/" + urlVersioning.toString() + "/hospitals", hospitalRoutes);
//server.use("/hospitals", hospitalRoutes);

////const apiRoutes = require("./src/routes/api-routes");
//server.use("/api", apiRoutes);
// Handle errors
// -------------
const errorHandlers = require("./src/middleware/error_handler");
// Catch all invalid routes
server.use(errorHandlers.invalidRoute);
// Handle mongoose errors
server.use(errorHandlers.validationErrors);
// Export the server object
module.exports = server;
