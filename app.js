const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const logger = require('./utils/logger');
const config = require('./utils/config');
const blogsRouter = require('./controllers/blogs');
const middleware = require('./utils/middleware');

const app = express();

logger.info(`Connecting to ${config.MONGODB_URI}`);

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch((error) => {
    logger.error('Error connecting to MongoDB', error.message);
  });

app.use(cors());
app.use(express.json());

app.use('/api/blogs/', blogsRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
