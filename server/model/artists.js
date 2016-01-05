var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artistSchema = new Schema({
  name: String,
  icon: String,
});

module.exports = mongoose.model('Artist', artistSchema);