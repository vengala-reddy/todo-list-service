import TaskModel from "../models/taskModel.js";

const TaskController = {
  // POST /todolist/api/v1/user/add-list
  async createTask(req, res, next) {
    try {
      const taskData = {
        taskName: req.body.taskName,
        description: req.body.description,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        status: req.body.status,
        effortRequired: req.body.effortRequired,
      };
      const newTask = await TaskModel.create(taskData);
      res
        .status(201)
        .json({
          success: true,
          message: "Task created successfully",
          data: newTask,
        });
    } catch (error) {
      next(error); // pass to error handling middleware
    }
  },

  // GET /todolist/api/v1/user/list/all
  async getAllTasks(req, res, next) {
    try {
      const tasks = await TaskModel.findAll();
      res.status(200).json({
        success: true,
        message: "Tasks retrieved successfully",
        data: tasks,
        count: tasks.length,
      });
    } catch (error) {
      next(error); // pass to error handling middleware
    }
  },

  // GET /todolist/api/v1/user/list/:taskName
  async getTaskByName(req, res, next) {
    try {
      const { taskName } = req.params;
      const task = await TaskModel.findByName(decodeURIComponent(taskName));
      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task '${taskName}' not found`,
        });
      }

      res.status(200).json({
        success: true,
        message: `Task '${taskName}' found`,
        data: task,
      });
    } catch (error) {
      next(error); // pass to error handling middleware
    }
  },

  // PUT /todolist/api/v1/user/update/:taskId
    async updateTaskStatus(req, res, next) {
    try {
        const { taskId } = req.params;
        const updatedTask = await TaskModel.updateStatusByDate(taskId);
        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: `Task with ID '${taskId}' not found`,
            });
        }
        res.status(200).json({
            success: true,
            message: "Task status updated successfully",
            data: updatedTask,
        });
    } catch (error) {
        next(error); // pass to error handling middleware
    }
  }
};

export default TaskController;
