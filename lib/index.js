const app = require('./app');
const logger = require('./logger');

const PORT = parseInt(process.env.PORT, 10);

app.listen(PORT, () => {
  logger.info(`Walt server started on port ${PORT}`);
});