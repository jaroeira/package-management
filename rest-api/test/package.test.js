const path = require('path');
const fs = require('mz/fs');
const mongoose = require('mongoose');
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const supertest = require('supertest');
const testSetup = require('./utils/testSetup');
const createServer = require('../src/server');
const app = createServer();
const request = supertest(app);

var mongoServer = null;

describe('Package test', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    await testSetup.beforeAll(mongoServer, 'pkgmanagement-test', mongoose);
  });

  afterAll(async () => {
    await testSetup.afterAll(mongoServer, mongoose);
  });

  beforeEach(async () => {
    await testSetup.beforeEach();
  });

  afterEach(async () => {
    await testSetup.afterEach();
  });

  // Endpoint GET /packages/list --------------------------------------------

  describe('Endpoint GET /packages/list', () => {
    it('tests a successful query of all data of type firmware', async () => {
      const response = await request.get('/packages/list?type=firmware');
      const results = response.body.results;
      expect(response.status).toBe(200);
      expect(results.length).toBe(3);
    });

    it('tests a successful query of all data of type tool', async () => {
      const response = await request.get('/packages/list?type=tool');
      const results = response.body.results;
      expect(response.status).toBe(200);
      expect(results.length).toBe(2);
    });

    it('should filter by version', async () => {
      const response = await request.get(
        '/packages/list?type=tool&version=8.8.8'
      );
      const results = response.body.results;
      expect(response.status).toBe(200);
      expect(results.length).toBe(1);
      expect(results[0]._id).toBe('6290df06e232a27fd5c77a12');
    });

    it('should filter by supported devices', async () => {
      const response = await request.get(
        '/packages/list?type=firmware&supportedDeviceType[]=z'
      );
      const results = response.body.results;
      expect(response.status).toBe(200);
      expect(results.length).toBe(1);
      expect(results[0]._id).toBe('6290dee1e232a27fd5c77a0c');

      const response2 = await request.get(
        '/packages/list?type=firmware&supportedDeviceType[]=j&supportedDeviceType[]=e'
      );
      const results2 = response2.body.results;
      expect(response2.status).toBe(200);
      expect(results2.length).toBe(2);
    });

    it('should return status 400 when missin type param', async () => {
      const response = await request.get('/packages/list');
      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'Validation error: "type" is required'
      );
    });

    it('should return an empty array of results', async () => {
      const response = await request.get(
        '/packages/list?type=firmware&version=10.0.0'
      );
      expect(response.status).toBe(200);
      const results = response.body.results;
      const count = response.body.count;
      expect(results.length).toBe(0);
      expect(count).toBe(0);
    });
  });

  // Endpoint POST /packages/create --------------------------------------------

  describe('Endpoint POST /packages/create', () => {
    const sampleFilePath = path.join(__dirname, 'utils', 'sample-data.dav.zip');
    const samplePayload = {
      title: 'test',
      type: 'firmware',
      version: '1.1.1',
      supportedDeviceTypes: ['a'],
      file: 'file',
    };

    it('should create a new package', async () => {
      const response = await request
        .post('/packages/create')
        .attach('file', sampleFilePath)
        .field('title', 'test')
        .field('type', 'firmware')
        .field('version', '1.1.1')
        .field('supportedDeviceTypes[]', 'a');

      expect(response.status).toBe(201);

      const newPackage = response.body.newPackage;

      const uploadedFilePath = path.join(
        __dirname,
        '..',
        'src',
        'uploads',
        newPackage.fileName
      );

      const uploadedFileExists = await fs.exists(uploadedFilePath);

      expect(uploadedFileExists).toBeTruthy();

      await fs.unlink(uploadedFilePath);

      expect(newPackage.version).toBe('1.1.1');
      expect(newPackage.type).toBe('firmware');
      expect(newPackage.supportedDeviceTypes.length).toBe(1);
      expect(newPackage.supportedDeviceTypes[0]).toBe('a');
    });

    it('should return error when file is missing', async () => {
      const payload = { ...samplePayload };
      delete payload.file;
      const response = await request.post('/packages/create').send(payload);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'Validation error: "file" is required'
      );
    });

    it('should return error when version has wrong format', async () => {
      const payload = { ...samplePayload, version: '10.10.10.10' };
      const response = await request.post('/packages/create').send(payload);

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(
        'Validation error: "version" with value "10.10.10.10" fails to match the required pattern: /^\\d+(?:\\.\\d+){2}$/'
      );
    });
  });

  // Endpoint GET /packages/get-by-id ------------------------------------------

  describe('Endpoint GET /packages/get-by-id', () => {
    it('should fetch a package by id', async () => {
      const response = await request.get(
        '/packages/get-by-id?id=6290dee1e232a27fd5c77a0c'
      );

      expect(response.status).toBe(200);
      expect(response.body.package._id).toBe('6290dee1e232a27fd5c77a0c');
      expect(response.body.package.title).toBe('Firmware 2');
      expect(response.body.package.type).toBe('firmware');
      expect(response.body.package.version).toBe('2.0.1');
    });

    it('should return error when id is missing', async () => {
      const response = await request.get('/packages/get-by-id');

      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Validation error: "id" is required');
    });

    it('shoud return error of package not found', async () => {
      const response = await request.get('/packages/get-by-id?id=a');
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Package not found');
    });
  });

  // Endpoint PUT /packages/update ---------------------------------------------

  describe('Endpoint PUT /packages/update', () => {
    const packageData = {
      packageId: '6290defee232a27fd5c77a10',
      title: 'UPDATED',
      type: 'tool',
      version: '1.1.1',
      supportedDeviceTypes: ['a'],
    };

    it('should update a package', async () => {
      const response = await request.put('/packages/update').send(packageData);
      expect(response.status).toBe(200);
      expect(response.body.updatedPackage._id).toBe('6290defee232a27fd5c77a10');
      expect(response.body.updatedPackage.title).toBe('UPDATED');
      expect(response.body.updatedPackage.version).toBe('1.1.1');
    });

    it('shoud return package not found', async () => {
      const payload = { ...packageData, packageId: 'a' };
      const response = await request.put('/packages/update').send(payload);
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Package not found');
    });
  });

  // Endpoint DELETE /packages/delete ------------------------------------------

  describe('Endpoint DELETE /packages/delete', () => {
    it('should delete a package', async () => {
      const payload = { packageId: '6290df06e232a27fd5c77a12' };
      const response = await request.delete('/packages/delete').send(payload);
      expect(response.status).toBe(200);

      const response2 = await request.delete('/packages/delete').send(payload);
      expect(response2.status).toBe(404);
    });

    it('should return status 400 for missing packageId', async () => {
      const response = await request.delete('/packages/delete').send({});
      expect(response.status).toBe(400);
    });

    it('should return status 400 for missing packageId', async () => {
      const payload = { packageId: '6286695b6f1b5213c136c0a1' };
      const response = await request.delete('/packages/delete').send(payload);
      expect(response.status).toBe(404);

      const response2 = await request
        .delete('/packages/delete')
        .send({ packageId: 'a' });
      expect(response2.status).toBe(404);
    });
  });
});
