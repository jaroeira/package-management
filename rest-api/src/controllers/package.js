const Package = require('../model/package');
const isValidId = require('mongoose').Types.ObjectId.isValid;
const { deleteFile } = require('../helper/file-helper');

exports.createPackage = async (req, res, next) => {
  const { title, type, version, supportedDeviceTypes, file } = req.body;

  const newPackage = new Package({
    title: title,
    type: type,
    version: version,
    supportedDeviceTypes: supportedDeviceTypes,
    fileName: file.filename,
  });

  try {
    await newPackage.save();
  } catch (err) {
    next(err);
  }

  res
    .status(201)
    .json({ message: 'Package created successfully!', newPackage });
};

exports.getPackageById = async (req, res, next) => {
  const { id } = req.body;

  try {
    //is it a valid mongoDB id?
    if (!isValidId(id)) throw 'Package not found';

    const packageObj = await Package.findById(id);

    if (!packageObj) throw 'Package not found';

    res.status(200).json({ package: packageObj });
  } catch (err) {
    next(err);
  }
};

exports.listPackages = async (req, res, next) => {
  const filter = { ...req.body };

  const query = getQuery(filter);

  //TODO: Implement pagination

  try {
    const results = await Package.find(query);

    res
      .status(200)
      .json({ results: results, count: results.length, filter: filter });
  } catch (err) {
    next(err);
  }
};

exports.updatePackage = async (req, res, next) => {
  const { packageId, title, type, version, supportedDeviceTypes } = req.body;

  const update = {
    title,
    type: type,
    version,
    supportedDeviceTypes,
    updated: Date.now(),
  };

  try {
    //is it a valid mongoDB id?
    if (!isValidId(packageId)) throw 'Package not found';

    const updatedPackage = await Package.findByIdAndUpdate(packageId, update, {
      new: true,
    });

    if (!updatedPackage) throw 'Package not found';

    res.status(200).json({ updatedPackage });
  } catch (err) {
    next(err);
  }
};

exports.deletePackage = async (req, res, next) => {
  const { packageId } = req.body;

  try {
    //is it a valid mongoDB id?
    if (!isValidId(packageId)) throw 'Package not found';

    const packageObj = await Package.findById(packageId);
    if (!packageObj) throw 'Package not found';

    const fileName = packageObj.fileName;

    await packageObj.remove();

    deleteFile(fileName);

    res
      .status(200)
      .json({ message: 'Package successfully deleted', packageId: packageId });
  } catch (err) {
    next(err);
  }
};

// Helper

const getQuery = (filter) => {
  let query = {};

  query.type = filter.type;
  if (filter.version) query.version = filter.version;
  if (filter.supportedDeviceType)
    query.supportedDeviceTypes = { $all: [...filter.supportedDeviceType] };

  return query;
};
