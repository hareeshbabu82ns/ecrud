var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var albumSchema = new Schema({
  name: String,
  lang: String,
  icon: String,
});

module.exports = mongoose.model('Album', albumSchema);