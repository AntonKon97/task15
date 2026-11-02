const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

router.route("/token").post(authController.generateNewToken);
router.route("/logout").delete(authController.invalidateRefreshToken);
router.route("/login").post(authController.authenticateUser);
router.route("/signup").post(authController.signupUser);

module.exports = router;
