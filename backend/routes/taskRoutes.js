const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const taskController = require("../controllers/taskController");
const taskValidator = require("../utils/validators/taskValidator");
const { setUserId, filterUserResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterUserResults, taskController.getAllTasks)
  .post(
    taskValidator.createTaskValidator,
    setUserId,
    taskController.createTask
  );

router
  .route("/:id")
  .get(taskValidator.getTaskValidator, taskController.getTask)
  .patch(taskValidator.updateTaskValidator, taskController.updateTask)
  .delete(taskValidator.getTaskValidator, taskController.deleteTask);

router.patch(
  "/:id/complete",
  taskValidator.completeTaskValidator,
  taskController.completeTask
);

module.exports = router;
