const LOG_LEVELS = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

const logger = {
  error: (message, meta = {}) => {
    console.error(
      `[${new Date().toISOString()}] ${LOG_LEVELS.ERROR}: ${message}`,
      meta
    );
  },
  warn: (message, meta = {}) => {
    console.warn(
      `[${new Date().toISOString()}] ${LOG_LEVELS.WARN}: ${message}`,
      meta
    );
  },
  info: (message, meta = {}) => {
    console.info(
      `[${new Date().toISOString()}] ${LOG_LEVELS.INFO}: ${message}`,
      meta
    );
  },
  debug: (message, meta = {}) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug(
        `[${new Date().toISOString()}] ${LOG_LEVELS.DEBUG}: ${message}`,
        meta
      );
    }
  },
};

export default logger;
