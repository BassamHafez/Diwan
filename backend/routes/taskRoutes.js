const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const taskController = require("../controllers/taskController");
const taskValidator = require("../utils/validators/taskValidator");
const { setAccountId, filterAccountResults } = require("../utils/requestUtils");

router.use(authController.protect);

router
  .route("/")
  .get(filterAccountResults, taskController.getAllTasks)
  .post(
    taskValidator.createTaskValidator,
    authController.checkPermission("ADD_TASK"),
    setAccountId,
    taskController.createTask
  );

router
  .route("/:id")
  .get(taskValidator.getTaskValidator, taskController.getTask)
  .patch(
    taskValidator.updateTaskValidator,
    authController.checkPermission("UPDATE_TASK"),
    taskController.updateTask
  )
  .delete(
    taskValidator.getTaskValidator,
    authController.checkPermission("DELETE_TASK"),
    taskController.deleteTask
  );

router.patch(
  "/:id/complete",
  taskValidator.completeTaskValidator,
  authController.checkPermission("COMPLETE_TASK"),
  taskController.completeTask
);

module.exports = router;
