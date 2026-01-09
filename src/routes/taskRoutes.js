import { Router } from "express";
import TaskController from "../controllers/taskController.js";
import { validateTaskInput, sanitizeInput } from "../middleware/validator.js";

const router = Router();
router.post('/add-list', sanitizeInput, validateTaskInput, TaskController.createTask);
router.get('/list/all', TaskController.getAllTasks);
router.get('/list/:taskName', TaskController.getTaskByName);
router.put('/update/:taskId', TaskController.updateTaskStatus);

export default router;