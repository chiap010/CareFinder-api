const express = require("express");
const { catchErrors } = require("../middleware/error_handler");
const userController = require("../controllers/user-controller");

// Declare the Express Router
const router = express.Router();

// Define our routes for each HTTP method required.  The second argument shows which part of the controller
// will be run, but catching errors when we encounter them

router.get("/", catchErrors(userController.read));
router.post("/", catchErrors(userController.post));
router.delete("/", catchErrors(userController.remove));

module.exports = router;
