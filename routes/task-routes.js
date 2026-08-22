const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task-controller");
const upload = require("../middlewares/multer-middleware");
const authenticate = require("../middlewares/authenticate-middleware");

router.use(authenticate);

router.post("/", upload.single("imageUrl"), taskController.createTask);
router.get("/", taskController.getAllTasks);
router.get("/:id", taskController.getTaskById);
router.put("/:id", upload.single("imageUrl"), taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

module.exports = router;;