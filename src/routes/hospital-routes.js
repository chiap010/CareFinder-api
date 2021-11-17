const express = require("express");
const { catchErrors } = require("../middleware/error_handler");
const hospitalController = require("../controllers/hospital-controller");

const router = express.Router();

router.get("/", catchErrors(hospitalController.read));

module.exports = router;
