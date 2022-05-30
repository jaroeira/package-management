const express = require('express');
const cors = require('cors');
const path = require('path');
const packageRoutes = require('./routes/package');
const errorHandler = require('./middleware/error-handler');

const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: true, credentials: true }));

  //Public folder
  app.use('/download', express.static(path.join(__dirname, 'uploads')));

  //Routes
  app.use('/packages', packageRoutes);

  //Handle error response
  app.use(errorHandler);

  //Handle 404 not found
  app.use('*', (req, res, next) => {
    res.status(404).json({ status: 404, message: 'Not Found' });
  });

  return app;
};

module.exports = createServer;
