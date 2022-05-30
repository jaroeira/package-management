const express = require('express');
const router = express.Router();
const Joi = require('joi');
const schemaValidationHandler = require('../middleware/schema-validation-handler');
const fileStorage = require('../middleware/file-storage');

const packageController = require('../controllers/package');

//GET - /packages/list
const validateListpackagesSchema = (req, res, next) => {
  const schema = Joi.object({
    type: Joi.string().valid('firmware', 'tool').required(),
    version: Joi.string().pattern(new RegExp(/^\d+(?:\.\d+){2}$/)),
    supportedDeviceType: Joi.array().items(Joi.string()),
  });

  schemaValidationHandler(req, next, schema);
};

router.get('/list', validateListpackagesSchema, packageController.listPackages);

//POST - /packages/create
const validateCreatePackageSchema = (req, res, next) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    type: Joi.string().valid('firmware', 'tool').required(),
    version: Joi.string()
      .required()
      .pattern(new RegExp(/^\d+(?:\.\d+){2}$/)),
    supportedDeviceTypes: Joi.array().items(Joi.string()).required(),
    file: Joi.required(),
  });

  schemaValidationHandler(req, next, schema);
};

router.post(
  '/create',
  fileStorage,
  validateCreatePackageSchema,
  packageController.createPackage
);

//GET - /packages/get-by-id
const validateGetPackageByIdSchema = (req, res, next) => {
  const schema = Joi.object({
    id: Joi.string().required(),
  });
  schemaValidationHandler(req, next, schema);
};

router.get(
  '/get-by-id',
  validateGetPackageByIdSchema,
  packageController.getPackageById
);

//PUT - /packages/update
const validateUpdatePackageSchema = (req, res, next) => {
  const schema = Joi.object({
    packageId: Joi.string().required(),
    title: Joi.string().required(),
    type: Joi.string().valid('firmware', 'tool').required(),
    version: Joi.string()
      .required()
      .pattern(new RegExp(/^\d+(?:\.\d+){2}$/)),
    supportedDeviceTypes: Joi.array().items(Joi.string()).required(),
  });

  schemaValidationHandler(req, next, schema);
};

router.put(
  '/update',
  validateUpdatePackageSchema,
  packageController.updatePackage
);

//DELETE - /packages/delete
const validateDeletePackageSchema = (req, res, next) => {
  const schema = Joi.object({
    packageId: Joi.string().required(),
  });

  schemaValidationHandler(req, next, schema);
};

router.delete(
  '/delete',
  validateDeletePackageSchema,
  packageController.deletePackage
);

module.exports = router;
