import logger from "../utils/logger.js";

export function validateTaskInput(req, res, next) {
  const { taskName, description, startDate, endDate, status, effortRequired } =
    req.body;
  const errors = [];

  // validation check for all required fields
  if (!taskName?.trim()) {
    errors.push("Task name is required.");
  }
  if (!description?.trim()) {
    errors.push("Description is required.");
  }
  if (!startDate) {
    errors.push("Start date is required.");
  }
  if (!endDate) {
    errors.push("End date is required.");
  }
  if (!status?.trim()) {
    errors.push("Status is required.");
  }
  if (effortRequired == null) {
    errors.push("Effort required is required.");
  }
  // validation check for effort > 0
  if (effortRequired === undefined || effortRequired === null) {
    errors.push("Effort required is mandatory.");
  } else if (typeof effortRequired !== "number" || effortRequired <= 0) {
    errors.push("Effort required must be greater than zero.");
  }
  // validate check for dates
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime())) {
      errors.push("Start date is invalid.");
    }
    if (isNaN(end.getTime())) {
      errors.push("End date is invalid.");
    }
    if (end < start) {
      errors.push("End date must be greater than start date.");
    }
  }
  if (errors.length > 0) {
    logger.warn("Validation errors: ", errors);
    return res.status(400).json({
      success: false,
      message: "Validation errors occurred.",
      errors,
    });
  }
  next();
}

export function sanitizeInput(req, res, next) {
  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = req.body[key]
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");
      }
    }
  }
  next();
}
