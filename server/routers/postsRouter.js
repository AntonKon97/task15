const express = require("express");
const router = express.Router();

const postsController = require("../controllers/postsController");
const authController = require("../controllers/authController");

router.use(authController.authenticateToken);

router.route("/").get(postsController.getAllPosts);
router.route("/my").get(postsController.getUserPosts);
router.route("/:id").patch(postsController.updatePost);

module.exports = router;