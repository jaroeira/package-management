const contentTypeParser = require('content-type-parser');
const { deleteFile } = require('../helper/file-helper');

const options = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

const schemaValidationHandler = (req, next, schema) => {
  let params = req.method === 'GET' ? req.query : req.body;

  const contentType = req.headers['content-type']
    ? contentTypeParser(req.headers['content-type']).subtype
    : 'application/json';

  if (contentType === 'form-data' && req.file) {
    params = { ...params, [req.file.fieldname]: req.file };
  }

  const { error, value } = schema.validate(params, options);

  if (error) {
    if (req.file) {
      deleteFile(req.file.filename);
    }

    next(
      `Validation error: ${error.details.map((err) => err.message).join(', ')}`
    );
  } else {
    req.body = value;
    next();
  }
};

module.exports = schemaValidationHandler;
