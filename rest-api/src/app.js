const mongoose = require('mongoose');
const createServer = require('./server');

const PORT = process.env.PORT || 8080;
const DATABASE_URL =
  process.env.DATABASE_URL ||
  'mongodb://root:secret2@localhost:27017/pkgmanagement?authSource=admin';

mongoose
  .connect(DATABASE_URL)
  .then(() => {
    console.log('connected to mongoDB');
    const app = createServer();
    app.listen(PORT, () => {
      console.log('Node API listening on port ' + PORT);
    });
  })
  .catch((err) => console.error(err));
