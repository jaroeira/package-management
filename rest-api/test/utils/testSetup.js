const Package = require('../../src/model/package');
const testData = require('./testData');

module.exports.beforeEach = async () => {
  await Package.insertMany(testData);
};
module.exports.afterEach = async () => {
  await Package.deleteMany();
};

module.exports.beforeAll = async (server, dbName, mongoose) => {
  const dbOptions = {
    useNewUrlParser: true,
  };

  const dbUri = server.getUri(dbName);

  await mongoose.connect(dbUri, dbOptions).then(() => {
    console.log('Connected to test database');
  });
};

module.exports.afterAll = async (server, mongoose) => {
  await mongoose.connection.close();
  await server.stop();
  console.log('Disconnected from test database');
};
