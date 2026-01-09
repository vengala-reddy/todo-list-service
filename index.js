import app from './src/app.js';
import logger from './src/utils/logger.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`Todo List Service is running on http://localhost:${PORT}`);
  logger.info(`API Base URL: http://localhost:${PORT}/todolist/api/v1/user`);
});