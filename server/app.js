//http://www.sitepoint.com/creating-restful-apis-express-4/
var express = require('express');
var bodyParser = require('body-parser');
var gods = require('./routes/gods');
var gods_t = require('./routes/gods_t');
var artists = require('./routes/artists');
var artists_t = require('./routes/artists_t');
var albums = require('./routes/albums');
var albums_t = require('./routes/albums_t');
var languages = require('./routes/langs');
var tests = require('./routes/tests');
var path = require('path');
var app = express(); //Create the Express app

//configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(express.static(path.join(__dirname, '../client')));
app.use('/partials', express.static(path.join(__dirname, '../client/partials')));
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));

app.use('/api', gods); //gods route middleware
app.use('/api', gods_t); //god text route middleware
app.use('/api', artists); //artists route middleware
app.use('/api', artists_t); //artist text route middleware
app.use('/api', languages); //languages route middleware
app.use('/api', albums); //albums route middleware
app.use('/api', albums_t); //album text route middleware
app.use('/api', tests); //This is our route middleware

app.set('port', process.env.PORT || 3000);


var server = app.listen(app.get('port'), function () {
  console.log('Express server listening on port ' + server.address().port);
});