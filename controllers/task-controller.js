const Task = require("../models/task-model");
const deleteUploadedFile = require("../utils/delete-uploaded-file");

// Create
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      status,
      dueDate,
      imageUrl: req.file?.filename,
      user: req.user._id,
    });

    res.status(201).json(task);
  } catch (error) {
    if (req.file) {
      deleteUploadedFile("tasks", req.file.filename);
    }
    res.status(500).json({ message: error.message });
  }
};

// Read - all tasks (بس تاسكس اليوزر نفسه، إلا لو admin يشوف الكل)
exports.getAllTasks = async (req, res) => {
  try {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };
    const tasks = await Task.find(filter);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Read - single task
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && task.user?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not have permission to view this task" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && task.user?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not have permission to update this task" });
    }

    if (req.file) {
      req.body.imageUrl = req.file.filename;
      if (task.imageUrl) deleteUploadedFile("tasks", task.imageUrl);
    }

    Object.assign(task, req.body);
    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    if (req.file) {
      deleteUploadedFile("tasks", req.file.filename);
    }
    res.status(500).json({ message: error.message });
  }
};

// Delete
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role !== "admin" && task.user?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "You do not have permission to delete this task" });
    }

    await Task.findByIdAndDelete(req.params.id);

    if (task.imageUrl) {
      deleteUploadedFile("tasks", task.imageUrl);
    }

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};