const mongoose = require('mongoose');
const { Schema } = mongoose;

const packageSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  version: {
    type: String,
    required: true,
  },
  supportedDeviceTypes: {
    type: [String],
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  updated: { type: Date },
  created: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Package', packageSchema);
