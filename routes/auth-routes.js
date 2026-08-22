const express = require("express");
const authController = require("../controllers/auth-controller");
const upload = require("../middlewares/multer-middleware");
const authenticate = require("../middlewares/authenticate-middleware");
const authorize = require("../middlewares/authorize-middleware");

const router = express.Router();

// Public routes
router.post("/signup", upload.single("imageUrl"), authController.signup);
router.post("/signin", authController.signin);

// Admin-only routes
router.get("/users", authenticate, authorize("admin"), authController.getAllUsers);
router.delete("/users/:id", authenticate, authorize("admin"), authController.deleteUser);

module.exports = router;