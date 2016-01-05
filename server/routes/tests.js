var express = require('express');
var router = express.Router();
var _ = require('underscore');

router.route('/tests')
  //create
  .post(function (req, res) {
    console.log(JSON.stringify(req.body));
  });

module.exports = router;
