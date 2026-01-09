import pool from "../config/database.js";
import logger from "../utils/logger.js";
const TaskModel = {
  async create(taskData) {
    const {
      taskName,
      description,
      startDate,
      endDate,
      status,
      effortRequired,
    } = taskData;
    // SQL INSERT statement - add a new task
    const query = `
            INSERT INTO tasks (task_name, description, start_date, end_date, status, effort_required)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;
    const values = [
      taskName,
      description,
      startDate,
      endDate,
      status,
      effortRequired,
    ];
    try {
      const result = await pool.query(query, values);
      logger.info("Task created successfully", { taskId: result.rows[0].id });
      return result.rows[0];
    } catch (error) {
      logger.error("Error creating task", { error: error.message });
      throw error;
    }
  },
  async findAll() {
    // SQL SELECT statement - retrieve all tasks
    const query = `
        SELECT 
            id,
            task_name as "taskName",
            description,
            start_date as "startDate",
            end_date as "endDate",
            status,
            effort_required as "effortRequired",
            created_at as "createdAt"
        FROM tasks
        ORDER BY effort_required DESC
        `;
    try {
      const result = await pool.query(query);
      logger.info("Tasks retrieved successfully", {
        count: result.rows.length,
      });
      return result.rows;
    } catch (error) {
      logger.error("Error retrieving tasks", { error: error.message });
      throw error;
    }
  },
  async findByName(taskName) {
    // SQL SELECT statement - retrieve task by name
    const query = `
            SELECT
                id,
                task_name as "taskName",
                description,
                start_date as "startDate",
                end_date as "endDate",
                status,
                effort_required as "effortRequired"
            FROM tasks
            WHERE task_name = $1
        `;
    try {
      const result = await pool.query(query, [taskName]);
      if (result.rows.length === 0) {
        return null; // Task not found
      }
      logger.info("Task retrieved successfully", { taskName });
      return result.rows[0];
    } catch (error) {
      logger.error("Error retrieving task by name", {
        error: error.message,
        taskName,
      });
      throw error;
    }
  },
  async updateStatus(taskId, newStatus) {
    // SQL UPDATE statement - update task status
    const query = `
            UPDATE tasks
            SET status = $1, updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING *
        `;
    try {
      const result = await pool.query(query, [newStatus, taskId]);
      if (result.rows.length === 0) {
        return null; // Task not found
      }
      logger.info("Task status updated successfully", { taskId, newStatus });
      return result.rows[0];
    } catch (error) {
      logger.error("Error updating task status", { error: error.message });
      throw error;
    }
  },
  async updateStatusByDate(taskId) {
    // SQL UPDATE statement - update task status based on current date
    const query = `
            UPDATE tasks
            SET 
                status = CASE
                    WHEN end_date < CURRENT_DATE THEN 'PENDING'
                    ELSE 'COMPLETED'
                END,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $1
            RETURNING *
                `;
    try {
        const result = await pool.query(query, [taskId]);
        if (result.rows.length === 0) {
            return null; // Task not found
        }
        logger.info("Task status updated based on date successfully", { taskId });
        return result.rows[0];
    } catch (error) {
        logger.error("Error updating task status based on date", { error: error.message, taskId });
        throw error;
    }
  },
};
export default TaskModel;
