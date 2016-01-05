var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var godSchema = new Schema({
  name: String,
  icon: String,
});

module.exports = mongoose.model('God', godSchema);