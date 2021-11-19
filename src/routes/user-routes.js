const express = require("express");
const { catchErrors } = require("../middleware/error_handler");
const userController = require("../controllers/user-controller");

const router = express.Router();

router.get("/", catchErrors(userController.read));

router.post("/", catchErrors(userController.post));

router.delete("/", catchErrors(userController.remove));

module.exports = router;
