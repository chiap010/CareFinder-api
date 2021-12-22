// Created by Tom Chiapete
// Fall Semester 2021

const express = require("express");
const { catchErrors } = require("../middleware/error_handler");
const hospitalController = require("../controllers/hospital-controller");

// Declare the Express Router
const router = express.Router();

// Define our routes for each HTTP method required.  The second argument shows which part of the controller
// will be run, but catching errors when we encounter them

router.get("/", catchErrors(hospitalController.read));
router.delete("/", catchErrors(hospitalController.remove));
router.post("/", catchErrors(hospitalController.post));
router.put("/", catchErrors(hospitalController.put));

module.exports = router;
