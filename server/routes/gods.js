var express = require('express');
var router = express.Router();
var parseSrc = require('parse/node').Parse;
var Parse = require('kaiseki');
var _ = require('underscore');

var API_ID = 'hfQCYrLcY6EeX2jbJjgJCZV3MkYgB41MhAfSrkET';
var REST_API_KEY = 'fdhqoRWKgofoPahInUqBE7G2LGDltMiq5Kl4F37T';

//parseSrc.initialize("hfQCYrLcY6EeX2jbJjgJCZV3MkYgB41MhAfSrkET", "DNb4qR9LsQeGWDrgJpRVi7Rgn7KumrL2aSSPokRb");

var CLASS = 'gods'; //Parse Class (table name)
var CLASS_T = 'gods_t'; //Parse Class (table name)

var idField = 'objectId'; //Parse Key field name
var idFieldGod = 'godId'; //Parse Key field name

var parse = new Parse(API_ID, REST_API_KEY);

router.route('/gods')
  //read all
  .get(function (req, res) {
    parse.getObjects(CLASS, function (err, resp, body, success) {
      if (err) {
        return res.send(err);
      }
      res.json(body);
    });
  })
  //create
  .post(function (req, res) {
    parse.createObject(CLASS, req.body,
      function (err, resp, body, success) {
        if (err)
          return res.send(err);
        res.json(body);
      });
  });
router.route('/gods/:id')
  //read
  .get(function (req, res) {
    parse.getObject(CLASS, req.params.id,
      function (err, resp, body, success) {
        if (err) {
          return res.send(err);
        }
        res.json(body);
      });
  })
  //update
  .put(function (req, res) {
    parse.updateObject(CLASS, req.params.id, req.body,
      function (err, resp, body, success) {
        if (err) {
          return res.send(err);
        }
        var obj = {};
        obj[idField] = req.params.id;
        _.extend(body, obj);
        res.json(body);
      });
  })
  //delete
  .delete(function (req, res) {
    parse.deleteObject(CLASS, req.params.id,
      function (err, resp, body, success) {
        if (err) {
          return res.send(err);
        }
        res.json(body);
      });
  });
router.route('/gods/:id/texts')
  //read all texts of given GodID
  .get(function (req, res) {
    var params = {where: {godId: req.params.id}};
    parse.getObjects(CLASS_T, params, function (err, resp, body, success) {
      if (err) {
        return res.send(err);
      }
      res.json(body);
    });
  })//create texts of god
  .post(function (req, res) {
    _.extend(req.body, {}[idFieldGod] = req.params.id);
    parse.createObject(CLASS_T, req.body,
      function (err, resp, body, success) {
        if (err)
          return res.send(err);
        res.json(body);
      });
  });
module.exports = router;